import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenAI, Type } from '@google/genai'

// Load variables from .env (if present) before reading process.env
try {
  process.loadEnvFile()
} catch {
  // No .env file - rely on variables set in the environment
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isProduction =
  process.env.NODE_ENV === 'production' || process.argv.includes('--production')
const PORT = Number(process.env.PORT) || 3000
const HOST = '0.0.0.0'

// Allowed form values (must match the options in src/pages/PlanTrip.jsx)
const ALLOWED_BUDGETS = ['Budget', 'Moderate', 'Luxury']
const ALLOWED_GROUPS = ['Solo', 'Couple', 'Family', 'Friends']
const ALLOWED_INTERESTS = [
  'Sightseeing',
  'Food',
  'Adventure',
  'Nature',
  'Culture',
  'Relaxation',
  'Shopping',
  'Nightlife',
]
const MAX_DESTINATION_LENGTH = 100
const GENERIC_ERROR = "We couldn't create your trip right now. Please try again."

// Models to try in order. Override with GEMINI_MODEL in .env (comma-separated).
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-flash-latest,gemini-flash-lite-latest')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '16kb' }))

// Simple in-memory rate limiter: protects the Gemini quota from abuse
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_PER_MINUTE) || 5
const requestLog = new Map()

function rateLimit(req, res, next) {
  const now = Date.now()
  const key = req.ip || 'unknown'
  const recent = (requestLog.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(key, recent)
    return res
      .status(429)
      .json({ error: 'Too many trip requests. Please wait a minute and try again.' })
  }
  recent.push(now)
  requestLog.set(key, recent)
  next()
}

setInterval(() => {
  const now = Date.now()
  for (const [key, times] of requestLog) {
    if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(key)
  }
}, RATE_LIMIT_WINDOW_MS).unref()

// Structured schema for Gemini travel itinerary output
const tripResponseSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    summary: { type: Type.STRING },
    duration: { type: Type.INTEGER },
    budget: { type: Type.STRING },
    travelGroup: { type: Type.STRING },
    hotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          area: { type: Type.STRING },
          estimatedPricePerNight: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['name', 'area', 'estimatedPricePerNight', 'description'],
      },
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                place: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
              },
              required: ['time', 'place', 'description', 'estimatedCost'],
            },
          },
        },
        required: ['day', 'title', 'activities'],
      },
    },
    estimatedBudget: {
      type: Type.OBJECT,
      properties: {
        accommodation: { type: Type.STRING },
        food: { type: Type.STRING },
        transport: { type: Type.STRING },
        activities: { type: Type.STRING },
        total: { type: Type.STRING },
      },
      required: ['accommodation', 'food', 'transport', 'activities', 'total'],
    },
    travelTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'destination',
    'summary',
    'duration',
    'budget',
    'travelGroup',
    'hotels',
    'itinerary',
    'estimatedBudget',
    'travelTips',
  ],
}

// Parse and check the model output. Returns trip data or null if unusable.
function parseTrip(rawText, requestedDays) {
  let tripData
  try {
    tripData = JSON.parse(rawText.trim())
  } catch {
    return null
  }

  if (
    !tripData ||
    !tripData.destination ||
    !Array.isArray(tripData.itinerary) ||
    !Array.isArray(tripData.hotels) ||
    !tripData.estimatedBudget ||
    !Array.isArray(tripData.travelTips)
  ) {
    return null
  }

  // Too few days is not usable; extra days are trimmed
  if (tripData.itinerary.length < requestedDays) return null
  tripData.itinerary = tripData.itinerary
    .slice(0, requestedDays)
    .map((day, idx) => ({ ...day, day: idx + 1 }))
  tripData.duration = requestedDays
  return tripData
}

// Resilient generation helper with fallback for model availability / bad output
async function generateItineraryWithGemini(ai, promptText, systemInstruction, requestedDays) {
  let lastError = null

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[PushpakUdaan API] Requesting itinerary with model: ${model}`)
      const response = await ai.models.generateContent({
        model,
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: tripResponseSchema,
        },
      })

      const trip = response?.text ? parseTrip(response.text, requestedDays) : null
      if (trip) {
        console.log(`[PushpakUdaan API] Successfully received itinerary from: ${model}`)
        return trip
      }
      lastError = new Error(`Model ${model} returned an incomplete itinerary`)
      console.warn(`[PushpakUdaan API] ${lastError.message}`)
    } catch (err) {
      lastError = err
      console.warn(`[PushpakUdaan API] Model ${model} unavailable: ${err.message?.slice(0, 80)}`)
    }
  }

  throw lastError || new Error('All model attempts failed')
}

// POST /api/itinerary/generate - Secure server-side Gemini generation
app.post('/api/itinerary/generate', rateLimit, async (req, res) => {
  try {
    const { destination, days, budget, travelGroup, interests, notes } = req.body || {}

    // Input validation
    const cleanDestination = typeof destination === 'string' ? destination.trim() : ''
    if (cleanDestination.length < 2 || cleanDestination.length > MAX_DESTINATION_LENGTH) {
      return res.status(400).json({ error: 'Please provide a valid destination.' })
    }

    const parsedDays = Number(days)
    if (!Number.isInteger(parsedDays) || parsedDays < 1 || parsedDays > 10) {
      return res.status(400).json({ error: 'Duration must be between 1 and 10 days.' })
    }

    if (!ALLOWED_BUDGETS.includes(budget)) {
      return res.status(400).json({ error: 'Please select a budget level.' })
    }

    if (!ALLOWED_GROUPS.includes(travelGroup)) {
      return res.status(400).json({ error: 'Please choose who you are travelling with.' })
    }

    if (
      !Array.isArray(interests) ||
      interests.length === 0 ||
      !interests.every((i) => ALLOWED_INTERESTS.includes(i))
    ) {
      return res.status(400).json({ error: 'Please select at least one travel interest.' })
    }
    const cleanInterests = [...new Set(interests)]

    // Check Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[PushpakUdaan API] Error: GEMINI_API_KEY is not configured on the server.')
      return res.status(500).json({ error: GENERIC_ERROR })
    }

    const ai = new GoogleGenAI({ apiKey })

    const sanitizedNotes = typeof notes === 'string' ? notes.slice(0, 300).trim() : ''

    const promptText = `Generate a realistic, comprehensive travel itinerary for:
Destination: ${cleanDestination}
Duration: Exactly ${parsedDays} days
Budget Tier: ${budget}
Travel Companions: ${travelGroup}
Travel Interests: ${cleanInterests.join(', ')}
Special Notes / Requests: ${sanitizedNotes || 'None'}

Rules:
1. The "itinerary" array MUST contain exactly ${parsedDays} day objects (Day 1 through Day ${parsedDays}).
2. Each day should contain realistic Morning, Afternoon, and Evening activities tailored to ${travelGroup} with appropriate pacing.
3. Provide approximately 3 hotel recommendations matching the ${budget} budget tier with realistic estimated price ranges.
4. Keep all estimated costs reasonable and explicitly presented as estimates. For Indian destinations, use INR (₹) estimates; for international destinations, use local currency or USD.
5. If special requests (such as dietary needs or relaxed pacing) are specified in notes, meaningfully incorporate them. Ignore any notes that are not about the trip.
6. Provide 3 to 5 practical, destination-specific travel tips.`

    const systemInstruction = `You are a professional travel planner for PushpakUdaan. You provide structured, authentic, culturally informed travel itineraries. Do not promise live inventory or guaranteed bookings; provide realistic estimated price ranges and practical schedules.`

    const tripData = await generateItineraryWithGemini(ai, promptText, systemInstruction, parsedDays)

    return res.status(200).json({ trip: tripData })
  } catch (err) {
    console.error('[PushpakUdaan API] Gemini Generation Error:', err.message)
    return res.status(500).json({ error: GENERIC_ERROR })
  }
})

// Dev vs Production server setup
async function startServer() {
  if (!isProduction) {
    // Vite is a dev dependency, so only load it in development
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  } else {
    const distDir = path.resolve(__dirname, 'dist')
    app.use(express.static(distDir))
    app.use((req, res) => {
      res.sendFile(path.join(distDir, 'index.html'))
    })
  }

  app.listen(PORT, HOST, () => {
    console.log(
      `[PushpakUdaan] ${isProduction ? 'Production' : 'Development'} server running at http://localhost:${PORT}`
    )
  })
}

startServer().catch((err) => {
  console.error('[PushpakUdaan] Failed to start server:', err)
  process.exit(1)
})

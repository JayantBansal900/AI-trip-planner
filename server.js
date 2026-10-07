import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'
import { GoogleGenAI, Type } from '@google/genai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'

const app = express()
app.use(express.json({ limit: '1mb' }))

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

// Resilient generation helper with fallback for model availability
async function generateItineraryWithGemini(ai, promptText, systemInstruction) {
  const models = ['gemini-3.8-flash', 'gemini-flash-lite-latest', 'gemini-flash-latest']
  let lastError = null

  for (const model of models) {
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

      if (response && response.text) {
        console.log(`[PushpakUdaan API] Successfully received itinerary from: ${model}`)
        return response.text
      }
    } catch (err) {
      lastError = err
      console.warn(`[PushpakUdaan API] Model ${model} unavailable: ${err.message?.slice(0, 80)}`)
      // Continue to next available model in the sequence
    }
  }

  throw lastError || new Error('All model attempts failed')
}

// POST /api/itinerary/generate - Secure server-side Gemini generation
app.post('/api/itinerary/generate', async (req, res) => {
  try {
    const { destination, days, budget, travelGroup, interests, notes } = req.body || {}

    // Input validation
    if (!destination || typeof destination !== 'string' || destination.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid destination.' })
    }

    const parsedDays = Number(days)
    if (!parsedDays || parsedDays < 1 || parsedDays > 10) {
      return res.status(400).json({ error: 'Duration must be between 1 and 10 days.' })
    }

    if (!budget || typeof budget !== 'string') {
      return res.status(400).json({ error: 'Please select a budget level.' })
    }

    if (!travelGroup || typeof travelGroup !== 'string') {
      return res.status(400).json({ error: 'Please choose who you are travelling with.' })
    }

    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: 'Please select at least one travel interest.' })
    }

    // Check Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[PushpakUdaan API] Error: GEMINI_API_KEY is not configured on the server.')
      return res.status(500).json({ error: "We couldn't create your trip right now. Please try again." })
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })

    const sanitizedNotes = typeof notes === 'string' ? notes.slice(0, 300).trim() : ''

    const promptText = `Generate a realistic, comprehensive travel itinerary for:
Destination: ${destination.trim()}
Duration: Exactly ${parsedDays} days
Budget Tier: ${budget}
Travel Companions: ${travelGroup}
Travel Interests: ${interests.join(', ')}
Special Notes / Requests: ${sanitizedNotes || 'None'}

Rules:
1. The "itinerary" array MUST contain exactly ${parsedDays} day objects (Day 1 through Day ${parsedDays}).
2. Each day should contain realistic Morning, Afternoon, and Evening activities tailored to ${travelGroup} with appropriate pacing.
3. Provide approximately 3 hotel recommendations matching the ${budget} budget tier with realistic estimated price ranges.
4. Keep all estimated costs reasonable and explicitly presented as estimates. For Indian destinations, use INR (₹) estimates; for international destinations, use local currency or USD.
5. If special requests (such as dietary needs or relaxed pacing) are specified in notes, meaningfully incorporate them.
6. Provide 3 to 5 practical, destination-specific travel tips.`

    const systemInstruction = `You are a professional travel planner for PushpakUdaan. You provide structured, authentic, culturally informed travel itineraries. Do not promise live inventory or guaranteed bookings; provide realistic estimated price ranges and practical schedules.`

    const rawJsonText = await generateItineraryWithGemini(ai, promptText, systemInstruction)

    let tripData
    try {
      tripData = JSON.parse(rawJsonText.trim())
    } catch (parseErr) {
      console.error('[PushpakUdaan API] JSON Parse Error:', parseErr.message)
      return res.status(500).json({ error: "We couldn't create your trip right now. Please try again." })
    }

    // Validate structured fields
    if (
      !tripData.destination ||
      !Array.isArray(tripData.itinerary) ||
      !Array.isArray(tripData.hotels) ||
      !tripData.estimatedBudget ||
      !Array.isArray(tripData.travelTips)
    ) {
      console.error('[PushpakUdaan API] Incomplete schema received from model')
      return res.status(500).json({ error: "We couldn't create your trip right now. Please try again." })
    }

    // Ensure itinerary days match requested duration
    if (tripData.itinerary.length !== parsedDays) {
      console.warn(
        `[PushpakUdaan API] Day count mismatch: requested ${parsedDays}, got ${tripData.itinerary.length}. Normalizing.`
      )
      if (tripData.itinerary.length > parsedDays) {
        tripData.itinerary = tripData.itinerary.slice(0, parsedDays)
      }
    }
    tripData.duration = parsedDays

    return res.status(200).json({ trip: tripData })
  } catch (err) {
    console.error('[PushpakUdaan API] Gemini Generation Error:', err.message)
    return res.status(500).json({ error: "We couldn't create your trip right now. Please try again." })
  }
})

// Dev vs Production server setup
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: HOST, port: PORT },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')))
    app.use((req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
    })
  }

  app.listen(PORT, HOST, () => {
    console.log(`[PushpakUdaan] Server running at http://${HOST}:${PORT}`)
  })
}

startServer()

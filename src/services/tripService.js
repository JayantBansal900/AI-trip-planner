/**
 * Service to call the server-side PushpakUdaan Gemini itinerary endpoint.
 * Keeps all API and model communication secure on the server.
 */

export async function generateItinerary(preferences) {
  let response
  try {
    response = await fetch('/api/itinerary/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    })
  } catch {
    throw new Error('Could not reach the server. Check your internet connection and try again.')
  }

  // The server may return a non-JSON error page (e.g. a proxy 502)
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMessage = data?.error || "We couldn't create your trip right now. Please try again."
    throw new Error(errorMessage)
  }

  if (!data?.trip) {
    throw new Error("Invalid itinerary received from server.")
  }

  return data.trip
}

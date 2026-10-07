/**
 * Service to call the server-side PushpakUdaan Gemini itinerary endpoint.
 * Keeps all API and model communication secure on the server.
 */

export async function generateItinerary(preferences) {
  const response = await fetch('/api/itinerary/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMessage = data?.error || "We couldn't create your trip right now. Please try again."
    throw new Error(errorMessage)
  }

  if (!data?.trip) {
    throw new Error("Invalid itinerary received from server.")
  }

  return data.trip
}

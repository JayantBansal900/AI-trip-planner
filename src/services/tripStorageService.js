/**
 * PushpakUdaan LocalStorage Trip Persistence Service
 * Safe browser storage for user-saved travel itineraries.
 */

const STORAGE_KEY = 'pushpakudaan_saved_trips'

function generateUniqueId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'trip_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9)
}

/**
 * Retrieve all saved trips from localStorage.
 * Returns empty array if none exist or on JSON parsing error.
 */
export function getSavedTrips() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
  } catch (err) {
    console.warn('[TripStorage] Corrupted storage data detected, resetting gracefully:', err)
    return []
  }
}

/**
 * Save a generated itinerary and preferences.
 * Returns the newly saved trip object, or null on failure.
 */
export function saveTrip(preferences, itinerary) {
  if (!itinerary || !preferences) return null

  try {
    const existing = getSavedTrips()
    const id = generateUniqueId()
    const savedAt = new Date().toISOString()

    const newTrip = {
      id,
      savedAt,
      preferences: {
        destination: preferences.destination || itinerary.destination || '',
        days: preferences.days || itinerary.duration || 1,
        budget: preferences.budget || itinerary.budget || 'Moderate',
        travelGroup: preferences.travelGroup || itinerary.travelGroup || 'Solo',
        interests: Array.isArray(preferences.interests) ? [...preferences.interests] : [],
        notes: preferences.notes || '',
      },
      itinerary: {
        ...itinerary,
      },
    }

    const updated = [newTrip, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return newTrip
  } catch (err) {
    console.error('[TripStorage] Failed to save trip to localStorage:', err)
    return null
  }
}

/**
 * Get a specific saved trip by ID.
 */
export function getSavedTrip(id) {
  if (!id) return null
  const trips = getSavedTrips()
  return trips.find((t) => t.id === id) || null
}

/**
 * Delete a specific saved trip by ID.
 * Returns updated array of saved trips.
 */
export function deleteSavedTrip(id) {
  if (!id) return getSavedTrips()

  try {
    const existing = getSavedTrips()
    const filtered = existing.filter((t) => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return filtered
  } catch (err) {
    console.error('[TripStorage] Failed to delete trip from localStorage:', err)
    return getSavedTrips()
  }
}

/**
 * Check if a trip matching given ID or destination/duration is already saved.
 */
export function isTripSaved(id) {
  if (!id) return false
  const trips = getSavedTrips()
  return trips.some((t) => t.id === id)
}

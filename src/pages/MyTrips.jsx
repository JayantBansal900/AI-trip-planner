import { useState, useEffect } from 'react'
import { Compass } from 'lucide-react'
import { Button } from '../components/ui/button'
import { SavedTripCard } from '../components/SavedTripCard'
import { getSavedTrips, deleteSavedTrip } from '../services/tripStorageService'

export function MyTrips({ onNavigate, onViewTrip }) {
  const [savedTrips, setSavedTrips] = useState([])

  useEffect(() => {
    const trips = getSavedTrips()
    setSavedTrips(trips)
  }, [])

  const handleDeleteTrip = (id) => {
    const updated = deleteSavedTrip(id)
    setSavedTrips(updated)
  }

  return (
    <div className="bg-[#faf8f5] min-h-[calc(100vh-140px)] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Personal Travel Journal
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            My Trips
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
            Your saved journeys, all in one place.
          </p>
        </div>

        {savedTrips.length === 0 ? (
          /* Empty State */
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-stone-200/90 bg-white p-8 text-center shadow-xs sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 shadow-xs">
              <Compass className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">
              No saved trips yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-600">
              Trips you save will appear here. Start planning your next journey.
            </p>

            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('plan-trip')}
                className="gap-2 bg-teal-700 px-6 font-semibold text-white shadow-xs hover:bg-teal-800"
              >
                <Compass className="h-4 w-4" />
                <span>Plan a Trip</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Saved Trips Grid */
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedTrips.map((trip) => (
              <SavedTripCard
                key={trip.id}
                savedTrip={trip}
                onViewTrip={onViewTrip}
                onDeleteTrip={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

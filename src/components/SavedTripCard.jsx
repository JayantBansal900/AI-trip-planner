import { useState } from 'react'
import { Calendar, Wallet, Users, Trash2, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { getDestinationImage } from '../data/destinations'

function formatSavedDate(isoString) {
  if (!isoString) return ''
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function SavedTripCard({ savedTrip, onViewTrip, onDeleteTrip }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  if (!savedTrip) return null

  const { id, savedAt, preferences = {}, itinerary = {} } = savedTrip
  const destination = preferences.destination || itinerary.destination || 'Destination'
  const days = preferences.days || itinerary.duration || 1
  const budget = preferences.budget || itinerary.budget || 'Moderate'
  const travelGroup = preferences.travelGroup || itinerary.travelGroup || 'Solo'
  const interests = preferences.interests || []
  const destImageInfo = getDestinationImage(destination)
  const formattedDate = formatSavedDate(savedAt)

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true)
  }

  const handleConfirmDelete = () => {
    onDeleteTrip(id)
    setIsConfirmingDelete(false)
  }

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition hover:border-slate-300">
      {/* Destination Image with Badge */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 sm:h-48">
        <img
          src={destImageInfo.image}
          alt={destImageInfo.alt}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
            {destination}
          </h3>
          {formattedDate && (
            <p className="text-xs text-slate-200">
              Saved {formattedDate}
            </p>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
            <span className="inline-flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-teal-700" />
              <span>{days} Days</span>
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Wallet className="h-3.5 w-3.5 text-teal-700" />
              <span>{budget}</span>
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Users className="h-3.5 w-3.5 text-teal-700" />
              <span>{travelGroup}</span>
            </span>
          </div>

          {/* Interests */}
          {interests.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {interests.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
              {interests.length > 3 && (
                <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-600">
                  +{interests.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          {isConfirmingDelete ? (
            <div className="flex items-center justify-between rounded-xl bg-rose-50/80 p-2 text-xs">
              <span className="font-medium text-rose-800">
                Delete this trip?
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCancelDelete}
                  className="rounded-lg px-2.5 py-1 text-slate-600 hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="rounded-lg bg-rose-600 px-2.5 py-1 font-semibold text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={() => onViewTrip(savedTrip)}
                size="sm"
                className="gap-1.5 bg-teal-700 font-semibold text-white hover:bg-teal-800"
              >
                <span>View Trip</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center gap-1 rounded-lg p-2 text-xs text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
                title="Delete saved trip"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { Compass } from 'lucide-react'
import { Button } from '../components/ui/button'
import { DestinationCard } from '../components/DestinationCard'
import { POPULAR_DESTINATIONS } from '../data/destinations'

export function Explore({ onNavigate }) {
  return (
    <div className="bg-[#faf8f5] min-h-[calc(100vh-140px)] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Editorial Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Destination Gallery
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore destinations
            </h1>
            <p className="mt-2 text-sm text-stone-600 sm:text-base">
              Find visual inspiration from our curated travel photography.
            </p>
          </div>

          <Button
            onClick={() => onNavigate('plan-trip')}
            className="gap-2 bg-teal-700 font-semibold text-white shadow-xs hover:bg-teal-800"
          >
            <Compass className="h-4 w-4" />
            Plan a Trip
          </Button>
        </div>

        {/* Destinations Photography Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_DESTINATIONS.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSelect={() => onNavigate('plan-trip', destination.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

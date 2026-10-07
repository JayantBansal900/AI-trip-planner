import { MapPin, ArrowRight } from 'lucide-react'

export function DestinationCard({ destination, onSelect }) {
  if (!destination) return null

  return (
    <div
      onClick={() => onSelect(destination.name)}
      className="group relative flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-700/40 hover:shadow-md"
    >
      {/* Single Calm Photographic Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-900 sm:h-64">
        <img
          src={destination.image}
          alt={destination.alt || `${destination.name} travel photography`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

        {/* Floating Location Badge */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1 text-xs font-medium text-stone-200">
                <MapPin className="h-3 w-3 text-teal-400 shrink-0" />
                <span>{destination.location}</span>
              </p>
              <h3 className="mt-0.5 text-2xl font-bold tracking-tight text-white">
                {destination.name}
              </h3>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition group-hover:bg-teal-600 group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between bg-stone-50/60 px-4 py-3 border-t border-stone-100">
        <p className="text-xs font-medium text-stone-600">
          {destination.descriptor}
        </p>
        <span className="text-xs font-semibold text-teal-800 group-hover:underline">
          Plan trip &rarr;
        </span>
      </div>
    </div>
  )
}

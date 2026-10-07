import { MapPin, Building2, Tag } from 'lucide-react'

export function HotelCard({ hotel }) {
  if (!hotel) return null

  const { name, area, estimatedPricePerNight, description } = hotel

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 sm:p-6">
      <div>
        {/* Header with building icon & name */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 leading-snug sm:text-lg">
              {name}
            </h3>
            {area && (
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:text-sm">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{area}</span>
              </p>
            )}
          </div>
        </div>

        {/* Short description */}
        {description && (
          <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Estimated Price Footer */}
      <div className="mt-5 border-t border-slate-100 pt-3.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1 text-slate-500">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <span>Estimated rate</span>
          </span>
          <span className="font-semibold text-slate-900">
            {estimatedPricePerNight ? (
              <span>{estimatedPricePerNight} <span className="font-normal text-slate-500 text-xs">/ night</span></span>
            ) : (
              <span className="text-slate-400 italic">Check current rates</span>
            )}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-600">
          Approximate estimate based on selected budget.
        </p>
      </div>
    </div>
  )
}

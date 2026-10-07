import { Sunrise, Sun, Moon, MapPin, Wallet, Clock } from 'lucide-react'

function getTimeIcon(time = '') {
  const lower = time.toLowerCase()
  if (lower.includes('morn') || lower.includes('dawn')) return Sunrise
  if (lower.includes('afternoon') || lower.includes('noon') || lower.includes('midday')) return Sun
  if (lower.includes('even') || lower.includes('night')) return Moon
  return Clock
}

export function DayItinerary({ dayData, dayNumber }) {
  if (!dayData) return null

  const { day, title, activities = [] } = dayData
  const displayDayNum = day || dayNumber

  return (
    <div id={`day-${displayDayNum}`} className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
      {/* Day Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-teal-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
            Day {displayDayNum}
          </span>
          {title && (
            <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h3>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-6 space-y-6">
        {activities.map((activity, idx) => {
          const TimeIcon = getTimeIcon(activity.time)
          const isLast = idx === activities.length - 1

          return (
            <div key={idx} className="relative flex items-start gap-4 sm:gap-6">
              {/* Timeline Connector */}
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                  <TimeIcon className="h-4 w-4" />
                </div>
                {!isLast && (
                  <div className="mt-2 h-full w-0.5 min-h-[48px] bg-slate-200" />
                )}
              </div>

              {/* Activity Details */}
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    {activity.time || 'Activity'}
                  </span>
                  {activity.place && (
                    <span className="text-xs text-slate-600 font-normal">
                      &bull;
                    </span>
                  )}
                  {activity.place && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {activity.place}
                    </span>
                  )}
                </div>

                <h4 className="mt-1 text-base font-semibold text-slate-900">
                  {activity.place || activity.description?.slice(0, 40) || 'Scheduled Visit'}
                </h4>

                {activity.description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {activity.description}
                  </p>
                )}

                {activity.estimatedCost && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-700 border border-slate-100">
                    <Wallet className="h-3 w-3 text-slate-400" />
                    <span>Estimated cost: <strong className="font-semibold text-slate-800">{activity.estimatedCost}</strong></span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

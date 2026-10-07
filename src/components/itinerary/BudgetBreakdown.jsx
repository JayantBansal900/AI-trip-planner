import { Building, Utensils, Compass, Ticket, Info } from 'lucide-react'

export function BudgetBreakdown({ budget }) {
  if (!budget) return null

  const items = [
    {
      label: 'Accommodation',
      value: budget.accommodation,
      icon: Building,
      subtext: 'Estimated hotel / stay costs',
    },
    {
      label: 'Food & Dining',
      value: budget.food,
      icon: Utensils,
      subtext: 'Local meals and snacks',
    },
    {
      label: 'Local Transport',
      value: budget.transport,
      icon: Compass,
      subtext: 'Taxis, rentals, or public transit',
    },
    {
      label: 'Activities & Entry Fees',
      value: budget.activities,
      icon: Ticket,
      subtext: 'Sightseeing and experiences',
    },
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {item.label}
                  </span>
                  <span className="block text-xs text-slate-600 sm:text-xs">
                    {item.subtext}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-900 sm:text-base">
                {item.value || '—'}
              </span>
            </div>
          )
        })}

        {/* Total Row */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <span className="text-base font-bold text-slate-900 sm:text-lg">
              Estimated Total
            </span>
            <span className="block text-xs text-slate-600">
              Approximate cost across all categories
            </span>
          </div>
          <span className="text-lg font-extrabold text-teal-800 sm:text-xl">
            {budget.total || '—'}
          </span>
        </div>
      </div>

      {/* Approximate Disclaimer Note */}
      <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
        <Info className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
        <p>
          These are approximate estimates and actual costs may vary based on seasonal demand, booking timing, and personal spending habits.
        </p>
      </div>
    </div>
  )
}

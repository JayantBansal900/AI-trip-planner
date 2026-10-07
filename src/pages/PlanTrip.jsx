import { useState, useEffect } from 'react'
import {
  MapPin,
  Calendar,
  Wallet,
  CreditCard,
  Gem,
  User,
  Heart,
  Home as HomeIcon,
  Users,
  Plus,
  Minus,
  ArrowRight,
  RotateCcw,
  Check,
  Sparkles,
  Info,
  AlertCircle,
  PlaneTakeoff,
  Loader2,
  Sliders,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { TripResult } from './TripResult'

const BUDGET_OPTIONS = [
  {
    id: 'Budget',
    title: 'Budget',
    subtitle: 'Keep costs low',
    icon: Wallet,
  },
  {
    id: 'Moderate',
    title: 'Moderate',
    subtitle: 'Comfort without overspending',
    icon: CreditCard,
  },
  {
    id: 'Luxury',
    title: 'Luxury',
    subtitle: 'Premium stays and experiences',
    icon: Gem,
  },
]

const TRAVEL_GROUP_OPTIONS = [
  {
    id: 'Solo',
    title: 'Solo',
    subtitle: 'Just me',
    icon: User,
  },
  {
    id: 'Couple',
    title: 'Couple',
    subtitle: 'Two travellers',
    icon: Heart,
  },
  {
    id: 'Family',
    title: 'Family',
    subtitle: 'Family trip',
    icon: HomeIcon,
  },
  {
    id: 'Friends',
    title: 'Friends',
    subtitle: 'Group adventure',
    icon: Users,
  },
]

const INTEREST_OPTIONS = [
  'Sightseeing',
  'Food',
  'Adventure',
  'Nature',
  'Culture',
  'Relaxation',
  'Shopping',
  'Nightlife',
]

export function PlanTrip({
  initialDestination = '',
  savedPreferences = null,
  generatedTrip = null,
  isGenerating = false,
  generationError = null,
  onSubmitPreferences,
  onRetry,
  onEditPreferences,
  onResetAll,
}) {
  const [destination, setDestination] = useState(
    savedPreferences?.destination || initialDestination || ''
  )
  const [days, setDays] = useState(savedPreferences?.days || 3)
  const [budget, setBudget] = useState(savedPreferences?.budget || 'Moderate')
  const [travelGroup, setTravelGroup] = useState(savedPreferences?.travelGroup || '')
  const [interests, setInterests] = useState(savedPreferences?.interests || [])
  const [notes, setNotes] = useState(savedPreferences?.notes || '')
  const [errors, setErrors] = useState({})

  // Sync if initialDestination updates from navigation (Home search or Explore card click)
  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination)
      setErrors((prev) => ({ ...prev, destination: '' }))
    }
  }, [initialDestination])

  // Sync if savedPreferences are updated
  useEffect(() => {
    if (savedPreferences) {
      setDestination(savedPreferences.destination || '')
      setDays(savedPreferences.days || 3)
      setBudget(savedPreferences.budget || 'Moderate')
      setTravelGroup(savedPreferences.travelGroup || '')
      setInterests(savedPreferences.interests || [])
      setNotes(savedPreferences.notes || '')
    }
  }, [savedPreferences])

  const toggleInterest = (interest) => {
    setInterests((prev) => {
      const exists = prev.includes(interest)
      const updated = exists ? prev.filter((i) => i !== interest) : [...prev, interest]
      if (updated.length > 0) {
        setErrors((errs) => ({ ...errs, interests: '' }))
      }
      return updated
    })
  }

  const handleDaysChange = (delta) => {
    setDays((prev) => {
      const next = Math.max(1, Math.min(10, prev + delta))
      setErrors((errs) => ({ ...errs, days: '' }))
      return next
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!destination || destination.trim().length === 0) {
      newErrors.destination = 'Please enter a destination.'
    } else if (destination.trim().length < 2) {
      newErrors.destination = 'Please enter at least 2 characters.'
    }

    if (!days || days < 1 || days > 10) {
      newErrors.days = 'Trip duration must be between 1 and 10 days.'
    }

    if (!budget) {
      newErrors.budget = 'Please select a budget level.'
    }

    if (!travelGroup) {
      newErrors.travelGroup = "Choose who you're travelling with."
    }

    if (!interests || interests.length === 0) {
      newErrors.interests = 'Select at least one interest.'
    }

    if (notes && notes.length > 300) {
      newErrors.notes = 'Notes must be 300 characters or less.'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    const preferences = {
      destination: destination.trim(),
      days: Number(days),
      budget,
      travelGroup,
      interests: [...interests],
      notes: notes.trim(),
    }

    if (onSubmitPreferences) {
      onSubmitPreferences(preferences)
    }
  }

  const handleReset = () => {
    setDestination('')
    setDays(3)
    setBudget('Moderate')
    setTravelGroup('')
    setInterests([])
    setNotes('')
    setErrors({})
    if (onResetAll) {
      onResetAll()
    }
  }

  // 1. Loading State View (while Gemini AI is generating)
  if (isGenerating) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-12 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 shadow-xs">
            <PlaneTakeoff className="h-8 w-8 animate-pulse" />
          </div>

          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Planning your journey to {destination || 'your destination'}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-stone-600 sm:text-base">
            Finding a balanced mix of places and experiences for your trip.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-stone-600">
            <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
            <span>Crafting personalized itinerary...</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. Error State View (with Retry and Edit Preferences options)
  if (generationError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            We couldn&apos;t plan this trip
          </h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            Something went wrong while creating your itinerary. Please try again.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={onRetry}
              className="gap-2 bg-teal-700 font-semibold text-white hover:bg-teal-800"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={onEditPreferences}
              className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              <Sliders className="h-4 w-4" />
              Edit Preferences
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 3. Generated Trip Result View (Phase 4 Final Travel Itinerary Experience)
  if (generatedTrip) {
    return (
      <TripResult
        trip={generatedTrip}
        preferences={savedPreferences}
        onEditPreferences={onEditPreferences}
        onRegenerate={onRetry}
        onPlanAnotherTrip={handleReset}
      />
    )
  }

  // 4. Default Interactive Form View
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Plan your trip
        </h1>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">
          Tell us a little about your journey and we&apos;ll create an itinerary around your preferences.
        </p>
      </div>

      {/* Form & Live Summary 2-Column Grid */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Main Form (7 cols on desktop) */}
        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-7" noValidate>
          {/* Field A: Destination */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <label
              htmlFor="destination-input"
              className="block text-base font-bold text-slate-900"
            >
              Where do you want to go?
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Enter your target city or travel destination.
            </p>

            <div className="relative mt-3">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="destination-input"
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value)
                  if (errors.destination) {
                    setErrors((prev) => ({ ...prev, destination: '' }))
                  }
                }}
                placeholder="Search a city or destination"
                className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-stone-400 transition-colors focus:outline-none ${
                  errors.destination
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-stone-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
                }`}
              />
            </div>

            {errors.destination && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <Info className="h-3.5 w-3.5 shrink-0" />
                {errors.destination}
              </p>
            )}

            {/* Quick suggestion chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] font-medium text-slate-400">Popular:</span>
              {['Goa', 'Manali', 'Jaipur', 'Bali', 'Paris', 'Tokyo'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setDestination(city)
                    setErrors((prev) => ({ ...prev, destination: '' }))
                  }}
                  className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 transition-colors hover:bg-teal-100 hover:text-teal-900"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Field B: Trip Duration */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <label className="block text-base font-bold text-slate-900">
              How many days are you planning?
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Choose duration between 1 and 10 days.
            </p>

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleDaysChange(-1)}
                disabled={days <= 1}
                aria-label="Decrease days"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/70 px-5 py-2.5">
                <Calendar className="h-4 w-4 text-teal-700" />
                <span className="text-lg font-bold text-slate-900">
                  {days} {days === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDaysChange(1)}
                disabled={days >= 10}
                aria-label="Increase days"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {errors.days && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <Info className="h-3.5 w-3.5 shrink-0" />
                {errors.days}
              </p>
            )}
          </div>

          {/* Field C: Budget */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <label className="block text-base font-bold text-slate-900">
              What&apos;s your budget?
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Select your preferred expenditure level.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {BUDGET_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = budget === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setBudget(option.id)
                      setErrors((prev) => ({ ...prev, budget: '' }))
                    }}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-200'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-teal-700 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="mt-3 text-sm font-bold text-slate-900">
                      {option.title}
                    </span>
                    <span className="mt-0.5 text-xs text-slate-500">
                      {option.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>

            {errors.budget && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <Info className="h-3.5 w-3.5 shrink-0" />
                {errors.budget}
              </p>
            )}
          </div>

          {/* Field D: Travel Group */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <label className="block text-base font-bold text-slate-900">
              Who are you travelling with?
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Helps tailor pace, lodging, and activities.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRAVEL_GROUP_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = travelGroup === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setTravelGroup(option.id)
                      setErrors((prev) => ({ ...prev, travelGroup: '' }))
                    }}
                    className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-200'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-teal-700 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="mt-2.5 text-sm font-bold text-slate-900">
                      {option.title}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-500">
                      {option.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>

            {errors.travelGroup && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <Info className="h-3.5 w-3.5 shrink-0" />
                {errors.travelGroup}
              </p>
            )}
          </div>

          {/* Field E: Travel Interests */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <label className="block text-base font-bold text-slate-900">
              What are you interested in?
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Select one or more themes for your itinerary.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = interests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'border border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    {interest}
                  </button>
                )
              })}
            </div>

            {errors.interests && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <Info className="h-3.5 w-3.5 shrink-0" />
                {errors.interests}
              </p>
            )}
          </div>

          {/* Field F: Optional Special Request */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <label
                htmlFor="notes-input"
                className="block text-base font-bold text-slate-900"
              >
                Anything else we should know?
              </label>
              <span className="text-[11px] font-medium text-slate-400">Optional</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Dietary preferences, accessibility needs, or pace preferences.
            </p>

            <div className="relative mt-3">
              <textarea
                id="notes-input"
                rows={3}
                maxLength={300}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value)
                  if (errors.notes) {
                    setErrors((prev) => ({ ...prev, notes: '' }))
                  }
                }}
                placeholder="e.g. I prefer vegetarian food, less crowded places, and a relaxed schedule."
                className="w-full rounded-xl border border-stone-200 p-3.5 text-sm text-slate-900 placeholder:text-stone-400 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 resize-none"
              />
              <div className="mt-1.5 flex justify-end">
                <span
                  className={`text-[11px] font-medium ${
                    notes.length >= 280 ? 'text-amber-600' : 'text-slate-400'
                  }`}
                >
                  {notes.length}/300
                </span>
              </div>
            </div>

            {errors.notes && (
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <Info className="h-3.5 w-3.5 shrink-0" />
                {errors.notes}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <Button
              type="submit"
              size="lg"
              className="gap-2 bg-teal-700 px-7 font-semibold text-white shadow-sm hover:bg-teal-800"
            >
              <span>Create My Trip</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Supporting Desktop Live Preference Summary (5 cols on desktop) */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-700" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Your Trip Summary
                </h2>
              </div>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                Live View
              </span>
            </div>

            {/* Destination preview */}
            <div className="mt-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Destination
              </span>
              <p className="text-xl font-extrabold text-slate-900">
                {destination.trim() || (
                  <span className="italic text-slate-400 font-normal">Choose a destination</span>
                )}
              </p>
            </div>

            {/* Badges / Metrics */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center">
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="block text-[10px] font-medium text-slate-400">Duration</span>
                <span className="text-xs font-bold text-slate-800">{days} Days</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="block text-[10px] font-medium text-slate-400">Budget</span>
                <span className="text-xs font-bold text-slate-800">{budget}</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <span className="block text-[10px] font-medium text-slate-400">Group</span>
                <span className="text-xs font-bold text-slate-800">
                  {travelGroup || <span className="italic font-normal text-slate-400">—</span>}
                </span>
              </div>
            </div>

            {/* Selected Interests */}
            <div className="mt-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Selected Interests
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5 min-h-[30px]">
                {interests.length > 0 ? (
                  interests.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">
                    No interests selected yet
                  </span>
                )}
              </div>
            </div>

            {/* Notes preview */}
            {notes.trim() && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Special Notes
                </span>
                <p className="mt-1 text-xs text-slate-600 italic line-clamp-3">
                  &ldquo;{notes.trim()}&rdquo;
                </p>
              </div>
            )}

            {/* AI notice */}
            <div className="mt-6 rounded-xl bg-teal-50/70 p-3 text-[11px] text-teal-900 border border-teal-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
              <p>
                Clicking &quot;Create My Trip&quot; will use PushpakUdaan AI to generate your customized day-by-day plan.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

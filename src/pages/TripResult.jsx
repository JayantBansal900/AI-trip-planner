import { useState, useEffect } from 'react'
import {
  Calendar,
  Wallet,
  Users,
  RotateCcw,
  Sliders,
  PlusCircle,
  Lightbulb,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { HotelCard } from '../components/itinerary/HotelCard'
import { DayItinerary } from '../components/itinerary/DayItinerary'
import { BudgetBreakdown } from '../components/itinerary/BudgetBreakdown'
import { getDestinationImage } from '../data/destinations'
import { saveTrip } from '../services/tripStorageService'

export function TripResult({
  trip,
  preferences,
  isSavedTrip = false,
  savedTripId = null,
  onEditPreferences,
  onRegenerate,
  onPlanAnotherTrip,
  onBackToMyTrips,
}) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all')
  const [isSaved, setIsSaved] = useState(Boolean(isSavedTrip || savedTripId))
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(
    isSavedTrip || savedTripId ? 'Saved' : ''
  )
  const [saveErrorMessage, setSaveErrorMessage] = useState('')

  useEffect(() => {
    if (!isSavedTrip && !savedTripId) {
      setIsSaved(false)
      setSaveSuccessMessage('')
      setSaveErrorMessage('')
    }
  }, [trip, isSavedTrip, savedTripId])

  if (!trip) return null

  const destImageInfo = getDestinationImage(trip.destination)
  const itineraryDays = Array.isArray(trip.itinerary) ? trip.itinerary : []
  const durationDays = trip.duration || itineraryDays.length || 1
  const hotels = Array.isArray(trip.hotels) ? trip.hotels : []
  const travelTips = Array.isArray(trip.travelTips) ? trip.travelTips : []
  const interests = preferences?.interests || []

  const handleSaveTrip = () => {
    if (isSaved) return
    setSaveErrorMessage('')

    try {
      const saved = saveTrip(preferences || {}, trip)
      if (saved) {
        setIsSaved(true)
        setSaveSuccessMessage('Trip saved')
        setTimeout(() => setSaveSuccessMessage('Saved'), 2500)
      } else {
        setSaveErrorMessage("We couldn't save this trip. Please try again.")
      }
    } catch {
      setSaveErrorMessage("We couldn't save this trip. Please try again.")
    }
  }

  // Filter days based on user selection
  const displayedDays =
    selectedDayFilter === 'all'
      ? itineraryDays
      : itineraryDays.filter((d, idx) => (d.day || idx + 1) === Number(selectedDayFilter))

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pb-20">
      {/* Top Action & Navigation Bar */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            {onBackToMyTrips && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToMyTrips}
                className="mr-1 gap-1 text-slate-600 hover:text-slate-900 px-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>My Trips</span>
              </Button>
            )}
            <span className="font-semibold text-slate-900">{trip.destination}</span>
            <span>&bull;</span>
            <span>{durationDays} Days</span>
            <span>&bull;</span>
            <span>{trip.budget}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Save Trip Button */}
            {isSaved ? (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold cursor-default"
              >
                <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{saveSuccessMessage || 'Saved'}</span>
              </Button>
            ) : (
              <Button
                onClick={handleSaveTrip}
                size="sm"
                className="gap-1.5 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Save Trip</span>
                <span className="sm:hidden">Save</span>
              </Button>
            )}

            <Button
              onClick={onEditPreferences}
              variant="outline"
              size="sm"
              className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Edit Preferences</span>
              <span className="sm:hidden">Edit</span>
            </Button>

            <Button
              onClick={onRegenerate}
              size="sm"
              className="gap-1.5 bg-teal-700 font-semibold text-white hover:bg-teal-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Regenerate Trip</span>
              <span className="sm:hidden">Regenerate</span>
            </Button>
          </div>
        </div>
        {saveErrorMessage && (
          <div className="bg-rose-50 px-4 py-2 text-center text-xs text-rose-700 border-t border-rose-100">
            {saveErrorMessage}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Destination Hero & Header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
          <div className="relative h-64 w-full sm:h-80 md:h-96">
            <img
              src={destImageInfo.image}
              alt={destImageInfo.alt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-medium text-white">
                <MapPin className="h-3 w-3" />
                <span>Travel Itinerary</span>
              </span>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                {trip.destination}
              </h1>

              <p className="mt-1 text-base font-medium text-slate-200 sm:text-lg">
                Your {durationDays}-day trip
              </p>
            </div>
          </div>

          {/* Quick Info & Metadata Strip */}
          <div className="border-t border-slate-100 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-700" />
                  <span className="font-semibold text-slate-900">{durationDays} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-teal-700" />
                  <span className="font-semibold text-slate-900">{trip.budget} Budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-700" />
                  <span className="font-semibold text-slate-900">{trip.travelGroup}</span>
                </div>
              </div>

              {/* Selected Interests */}
              {interests.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-600 font-medium mr-1">Interests:</span>
                  {interests.map((interest, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Trip Summary */}
            {trip.summary && (
              <div className="mt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  About your trip
                </h2>
                <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                  {trip.summary}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* In-Page Navigation Bar */}
        <div className="sticky top-0 z-10 mt-8 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xs backdrop-blur-sm">
          <div className="flex items-center gap-1 overflow-x-auto text-xs sm:text-sm scrollbar-none">
            <button
              onClick={() => scrollToSection('hotels-section')}
              className="rounded-xl px-3.5 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0"
            >
              Where to Stay
            </button>
            <button
              onClick={() => scrollToSection('itinerary-section')}
              className="rounded-xl px-3.5 py-2 font-semibold text-teal-800 bg-teal-50 shrink-0"
            >
              Itinerary
            </button>
            <button
              onClick={() => scrollToSection('budget-section')}
              className="rounded-xl px-3.5 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0"
            >
              Estimated Budget
            </button>
            {travelTips.length > 0 && (
              <button
                onClick={() => scrollToSection('tips-section')}
                className="rounded-xl px-3.5 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0"
              >
                Good to Know
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Where to Stay */}
        {hotels.length > 0 && (
          <section id="hotels-section" className="mt-12 scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Where to stay
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Recommended stays matching your {trip.budget.toLowerCase()} budget tier in {trip.destination}.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel, idx) => (
                <HotelCard key={idx} hotel={hotel} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Day-by-Day Itinerary */}
        <section id="itinerary-section" className="mt-14 scroll-mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your itinerary
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Day-by-day plan crafted for your schedule and pacing.
              </p>
            </div>

            {/* Day Selector Buttons */}
            {itineraryDays.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedDayFilter('all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedDayFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Days ({itineraryDays.length})
                </button>
                {itineraryDays.map((d, i) => {
                  const dayNum = d.day || i + 1
                  const isSelected = selectedDayFilter === String(dayNum)
                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDayFilter(String(dayNum))}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      Day {dayNum}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {displayedDays.map((dayData, idx) => (
              <DayItinerary
                key={dayData.day || idx}
                dayData={dayData}
                dayNumber={dayData.day || idx + 1}
              />
            ))}
          </div>
        </section>

        {/* Section 3: Budget Breakdown */}
        {trip.estimatedBudget && (
          <section id="budget-section" className="mt-14 scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Estimated trip budget
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Category estimates calculated for a {durationDays}-day trip with {trip.travelGroup}.
              </p>
            </div>

            <BudgetBreakdown budget={trip.estimatedBudget} />
          </section>
        )}

        {/* Section 4: Travel Tips */}
        {travelTips.length > 0 && (
          <section id="tips-section" className="mt-14 scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Good to know
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Practical tips and recommendations for your visit to {trip.destination}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
              <ul className="space-y-4">
                {travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700 mt-0.5">
                      <Lightbulb className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Bottom Actions Bar */}
        <section className="mt-14 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                Want to adjust this plan?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Refine your preferences, regenerate with fresh recommendations, or plan a different journey.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isSaved ? (
                <Button
                  disabled
                  variant="outline"
                  className="gap-2 border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold cursor-default"
                >
                  <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                  <span>{saveSuccessMessage || 'Saved'}</span>
                </Button>
              ) : (
                <Button
                  onClick={handleSaveTrip}
                  className="gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Save Trip</span>
                </Button>
              )}

              <Button
                onClick={onEditPreferences}
                variant="outline"
                className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Sliders className="h-4 w-4" />
                <span>Edit Preferences</span>
              </Button>

              <Button
                onClick={onRegenerate}
                className="gap-2 bg-teal-700 font-semibold text-white hover:bg-teal-800"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Regenerate Trip</span>
              </Button>

              <Button
                onClick={onPlanAnotherTrip}
                variant="ghost"
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Plan Another Trip</span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

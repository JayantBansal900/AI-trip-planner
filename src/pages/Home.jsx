import { useState, useEffect } from 'react'
import {
  MapPin,
  Search,
  ArrowRight,
  Compass,
  Sparkles,
  CalendarCheck,
  Sliders,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { DestinationCard } from '../components/DestinationCard'
import { HERO_SLIDES, POPULAR_DESTINATIONS } from '../data/destinations'

export function Home({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [heroIndex, setHeroIndex] = useState(0)

  // Automatic cinematic slideshow cycling every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onNavigate('plan-trip', searchQuery.trim())
  }

  return (
    <div className="flex flex-col bg-[#faf8f5]">
      {/* 1. CINEMATIC AUTOMATIC TRAVEL HERO SLIDESHOW */}
      <section className="relative px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Panoramic Hero Container */}
          <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] w-full overflow-hidden rounded-3xl shadow-md flex flex-col justify-end p-6 sm:p-10 lg:p-14 bg-slate-950">
            {/* Background Slideshow Layer */}
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === heroIndex
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
                    isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className={`h-full w-full object-cover object-center transition-transform duration-6000 ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>
              )
            })}

            {/* Gradient Overlays for optimal readability without losing photo vibrancy */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-900/35 z-10" />

            {/* Slide Location Indicator */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20 hidden sm:flex items-center gap-2 rounded-full bg-slate-950/50 px-3.5 py-1.5 backdrop-blur-md text-white border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-medium text-stone-200">
                {HERO_SLIDES[heroIndex].location}
              </span>
            </div>

            {/* Stable Hero Content Layer (Text never jumps or re-animates) */}
            <div className="relative z-20 max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-md border border-white/20">
                <Compass className="h-3.5 w-3.5 text-teal-300" />
                <span>DISCOVER • PLAN • EXPLORE</span>
                <span className="text-white/40">•</span>
                <span className="text-teal-200 text-[11px] font-medium">
                  AI-powered trip planning
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                Where will your next journey take you?
              </h1>

              <p className="mt-4 text-base leading-relaxed text-stone-200 sm:text-lg">
                Tell us where you want to go and PushpakUdaan will help you build
                a trip around your budget, travel style, and interests.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  size="lg"
                  onClick={() => onNavigate('plan-trip')}
                  className="gap-2 bg-teal-600 px-6 font-semibold text-white shadow-sm hover:bg-teal-500"
                >
                  Plan My Trip
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('explore')}
                  className="border-white/30 bg-white/10 font-medium text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                >
                  Explore Destinations
                </Button>
              </div>
            </div>

            {/* Slideshow Progress Bar */}
            <div className="absolute bottom-3 left-6 right-6 sm:bottom-4 sm:left-10 sm:right-10 z-20 flex gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i === heroIndex ? 'bg-teal-400' : 'bg-white/25'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Destination Search Bar */}
          <div className="mx-auto -mt-6 sm:-mt-8 max-w-3xl relative z-30 px-3 sm:px-0">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-2.5 shadow-md sm:flex-row sm:items-center sm:gap-3 sm:p-2 sm:pl-5"
            >
              <div className="flex flex-1 items-center gap-3 py-1">
                <MapPin className="h-5 w-5 text-teal-700 shrink-0" />
                <div className="flex-1">
                  <label
                    htmlFor="destination-search"
                    className="block text-[11px] font-bold uppercase tracking-wider text-stone-500"
                  >
                    Where do you want to go?
                  </label>
                  <input
                    id="destination-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search a destination... (e.g. Goa, Manali, Jaipur, Tokyo, Paris)"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="gap-2 bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 sm:h-12 sm:rounded-xl shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>Plan a Trip</span>
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Curated Inspiration</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Popular destinations
              </h2>
              <p className="mt-1 text-sm text-stone-600 sm:text-base">
                Explore photography from our top travel destinations.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => onNavigate('explore')}
              className="text-xs font-semibold text-teal-800 border-stone-300 bg-white hover:bg-stone-50"
            >
              View all destinations &rarr;
            </Button>
          </div>

          {/* 6 Curated Destination Cards Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_DESTINATIONS.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={() => onNavigate('plan-trip', destination.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="border-y border-stone-200/80 bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Plan a trip in three simple steps
          </h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            Everything you need for an unforgettable journey in minutes.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 text-left">
            {/* Step 1 */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="text-xs font-black tracking-wider text-stone-400">
                  01
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Choose your destination
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                Tell us where you want to go or browse destinations for travel inspiration.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Sliders className="h-5 w-5" />
                </span>
                <span className="text-xs font-black tracking-wider text-stone-400">
                  02
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Tell us your preferences
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                Set your travel dates, budget level, group type, and interests.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <span className="text-xs font-black tracking-wider text-stone-400">
                  03
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                Get your personalized itinerary
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                Receive a tailored day-by-day travel plan with hotels, places, and tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL TRAVEL CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-stone-200 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-8 sm:p-12 text-center text-white shadow-md">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-teal-200 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-teal-300" />
              <span>Smart Travel Itineraries</span>
            </div>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              Your next journey starts here.
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm text-stone-300 sm:text-base">
              Plan a trip around the way you actually like to travel.
            </p>

            <div className="mt-7 flex justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('plan-trip')}
                className="gap-2 bg-teal-500 px-7 font-semibold text-slate-950 shadow-sm hover:bg-teal-400"
              >
                Start Planning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

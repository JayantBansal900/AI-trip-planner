import { useState, useEffect, useRef } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { PlanTrip } from './pages/PlanTrip'
import { MyTrips } from './pages/MyTrips'
import { Explore } from './pages/Explore'
import { TripResult } from './pages/TripResult'
import { generateItinerary } from './services/tripService'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedDestination, setSelectedDestination] = useState('')

  // Trip generation state
  const [tripPreferences, setTripPreferences] = useState(null)
  const [generatedTrip, setGeneratedTrip] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState(null)

  // Saved trip currently being viewed (from localStorage)
  const [viewingSavedTrip, setViewingSavedTrip] = useState(null)

  // Increments for every new request so late responses from old requests are ignored
  const requestIdRef = useRef(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  const handleNavigate = (view, destination = '') => {
    if (view === 'plan-trip' && destination) {
      // A new destination starts a fresh plan: drop the old result and any pending request
      requestIdRef.current += 1
      setSelectedDestination(destination)
      setTripPreferences((prev) => (prev ? { ...prev, destination } : null))
      setGeneratedTrip(null)
      setGenerationError(null)
      setIsGenerating(false)
    }
    setViewingSavedTrip(null)
    setCurrentView(view)
  }

  const handleViewSavedTrip = (savedTrip) => {
    setViewingSavedTrip(savedTrip)
    setCurrentView('view-trip')
  }

  const handleGenerateTrip = async (preferences) => {
    const requestId = ++requestIdRef.current
    setTripPreferences(preferences)
    setGeneratedTrip(null)
    setIsGenerating(true)
    setGenerationError(null)

    try {
      const trip = await generateItinerary(preferences)
      if (requestId !== requestIdRef.current) return
      setGeneratedTrip(trip)
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setGenerationError(err.message || "We couldn't create your trip right now. Please try again.")
    } finally {
      if (requestId === requestIdRef.current) setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    if (tripPreferences) {
      handleGenerateTrip(tripPreferences)
    }
  }

  const handleEditPreferences = () => {
    setGeneratedTrip(null)
    setGenerationError(null)
    setCurrentView('plan-trip')
  }

  const handleResetAll = () => {
    requestIdRef.current += 1
    setIsGenerating(false)
    setTripPreferences(null)
    setGeneratedTrip(null)
    setGenerationError(null)
    setSelectedDestination('')
    setViewingSavedTrip(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        {currentView === 'plan-trip' && (
          <PlanTrip
            initialDestination={selectedDestination}
            savedPreferences={tripPreferences}
            generatedTrip={generatedTrip}
            isGenerating={isGenerating}
            generationError={generationError}
            onSubmitPreferences={handleGenerateTrip}
            onRetry={handleRetry}
            onEditPreferences={handleEditPreferences}
            onResetAll={handleResetAll}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'my-trips' && (
          <MyTrips
            onNavigate={handleNavigate}
            onViewTrip={handleViewSavedTrip}
          />
        )}
        {currentView === 'view-trip' && viewingSavedTrip && (
          <TripResult
            trip={viewingSavedTrip.itinerary}
            preferences={viewingSavedTrip.preferences}
            isSavedTrip={true}
            savedTripId={viewingSavedTrip.id}
            onEditPreferences={() => {
              setTripPreferences(viewingSavedTrip.preferences)
              setGeneratedTrip(null)
              setViewingSavedTrip(null)
              setCurrentView('plan-trip')
            }}
            onRegenerate={() => {
              setTripPreferences(viewingSavedTrip.preferences)
              setViewingSavedTrip(null)
              handleGenerateTrip(viewingSavedTrip.preferences)
              setCurrentView('plan-trip')
            }}
            onPlanAnotherTrip={() => {
              handleResetAll()
              setCurrentView('plan-trip')
            }}
            onBackToMyTrips={() => {
              setViewingSavedTrip(null)
              setCurrentView('my-trips')
            }}
          />
        )}
        {currentView === 'explore' && <Explore onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App

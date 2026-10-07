import { useState } from 'react'
import { Menu, X, Compass } from 'lucide-react'
import { Button } from './ui/button'
import { BrandLogo } from './BrandLogo'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'plan-trip', label: 'Plan Trip' },
  { id: 'my-trips', label: 'My Trips' },
  { id: 'explore', label: 'Explore' },
]

export function Navbar({ currentView, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (viewId) => {
    onNavigate(viewId)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1 -ml-1 transition hover:opacity-95"
          aria-label="PushpakUdaan Home"
        >
          <BrandLogo size="default" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'my-trips' && currentView === 'view-trip')
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex md:items-center">
          <Button
            onClick={() => handleNavClick('plan-trip')}
            className="gap-2 bg-teal-700 px-4 py-2 font-medium text-white shadow-xs hover:bg-teal-800"
          >
            <Compass className="h-4 w-4" />
            <span>Plan a Trip</span>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-200 bg-white px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === 'my-trips' && currentView === 'view-trip')
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 font-semibold text-teal-800'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
            <div className="pt-3">
              <Button
                onClick={() => handleNavClick('plan-trip')}
                className="w-full justify-center gap-2 bg-teal-700 font-medium text-white hover:bg-teal-800"
              >
                <Compass className="h-4 w-4" />
                <span>Plan a Trip</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

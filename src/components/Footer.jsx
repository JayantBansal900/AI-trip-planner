export function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-stone-800 bg-slate-950 text-stone-300">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand & compact tagline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 rounded"
              aria-label="PushpakUdaan Home"
            >
              {/* White-contrast version of BrandLogo */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-800 p-1 text-white shadow-xs">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full"
                  >
                    <path
                      d="M5 24C12 21 20 21 27 24"
                      stroke="#99f6e4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    <path
                      d="M6 19L26 8L17 25L14 17L6 19Z"
                      fill="currentColor"
                      fillOpacity="0.95"
                    />
                  </svg>
                </div>
                <span className="text-lg tracking-tight">
                  <span className="font-semibold text-white">Pushpak</span>
                  <span className="font-bold text-teal-400">Udaan</span>
                </span>
              </div>
            </button>
            <span className="hidden sm:inline text-stone-400 text-xs">&bull;</span>
            <span className="hidden sm:inline text-xs text-stone-300">
              Plan smarter. Travel better.
            </span>
          </div>

          {/* Compact navigation links */}
          <nav className="flex flex-wrap items-center gap-5 text-xs text-stone-200">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="transition-colors hover:text-white"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('plan-trip')}
              className="transition-colors hover:text-white"
            >
              Plan Trip
            </button>
            <button
              type="button"
              onClick={() => onNavigate('my-trips')}
              className="transition-colors hover:text-white"
            >
              My Trips
            </button>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="transition-colors hover:text-white"
            >
              Explore
            </button>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-stone-300">
            &copy; {currentYear} PushpakUdaan
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * PushpakUdaan Custom Brand Logo & Wordmark
 * Minimalist geometric travel mark combining an ascending flight path,
 * horizon curve, and subtle monogram geometry.
 */

export function BrandLogo({ size = 'default', showTagline = false, className = '' }) {
  const iconSizes = {
    sm: 'h-7 w-7',
    default: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textSizes = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Geometric Travel Mark */}
      <div
        className={`relative flex ${iconSizes[size] || iconSizes.default} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-teal-950 to-teal-800 p-1.5 text-white shadow-xs`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Subtle ascending horizon arc */}
          <path
            d="M5 24C12 21 20 21 27 24"
            stroke="#99f6e4"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Soaring geometric flight mark (stylized P-U upward journey) */}
          <path
            d="M6 19L26 8L17 25L14 17L6 19Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          {/* Accent flight contour */}
          <path
            d="M26 8L14 17"
            stroke="#5eead4"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typographic Wordmark */}
      <div className="flex flex-col text-left leading-none">
        <span
          className={`${textSizes[size] || textSizes.default} tracking-tight`}
        >
          <span className="font-semibold text-slate-900">Pushpak</span>
          <span className="font-bold text-teal-700">Udaan</span>
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-600">
            Plan smarter &bull; Travel better
          </span>
        )}
      </div>
    </div>
  )
}

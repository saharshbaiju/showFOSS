import { cn } from '@/lib/cn'

/** The showFOSS mark: a play triangle inside a screen, with a live dot —
 * the "control surface for a big screen" idea in miniature. */
export function BrandMark({ className, live = false }: { className?: string; live?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('shrink-0', className)} aria-hidden="true">
      <rect
        x="9"
        y="13"
        width="46"
        height="31"
        rx="6.5"
        className="fill-canvas"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M27.5 25C27.5 24.16 28.4 23.64 29.12 24.06L39.2 29.94C39.9 30.35 39.9 31.35 39.2 31.76L29.12 37.64C28.4 38.06 27.5 37.54 27.5 36.7V25Z"
        fill="currentColor"
      />
      <circle cx="46" cy="50.5" r="3.4" className={live ? 'fill-live' : 'fill-current opacity-30'} />
      <rect x="21" y="49" width="17" height="3" rx="1.5" className="fill-current opacity-20" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('text-[17px] font-semibold tracking-tight text-ink', className)}>
      show<span className="text-accent">FOSS</span>
    </span>
  )
}

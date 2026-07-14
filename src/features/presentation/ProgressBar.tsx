import { usePresentationStore } from '@/store/usePresentationStore'

interface ProgressBarProps {
  index: number
  count: number
}

/** Subscribes to `progress` on its own so the per-frame updates don't
 * re-render the rest of the presentation. */
export function ProgressBar({ index, count }: ProgressBarProps) {
  const progress = usePresentationStore((s) => s.progress)
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 pt-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <span className="font-data text-xs tabular-nums text-white/70">
        {count === 0 ? '0 / 0' : `${index + 1} / ${count}`}
      </span>
    </div>
  )
}

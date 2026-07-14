import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeTone = 'neutral' | 'accent' | 'live' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  mono?: boolean
}

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-canvas text-ink border border-line',
  accent: 'bg-accent-soft text-accent',
  live: 'bg-live/10 text-live',
  muted: 'bg-canvas text-muted border border-line',
}

export function Badge({ tone = 'neutral', mono, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-none',
        mono && 'font-data tabular-nums',
        TONES[tone],
        className,
      )}
      {...props}
    />
  )
}

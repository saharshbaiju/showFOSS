import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Segment<T extends string | number> {
  value: T
  label: ReactNode
  title?: string
}

interface SegmentedControlProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: Segment<T>[]
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl<T extends string | number>({
  value,
  onChange,
  options,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg bg-canvas p-0.5 border border-line',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            title={opt.title}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors cursor-pointer',
              size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-8 px-3 text-[13px]',
              active
                ? 'bg-surface text-ink shadow-soft'
                : 'text-muted hover:text-ink',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

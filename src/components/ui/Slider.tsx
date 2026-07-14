import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: number
}

/** Range input styled to the accent. Track fill uses a CSS gradient. */
export function Slider({ value, min = 0, max = 100, className, style, ...props }: SliderProps) {
  const lo = Number(min)
  const hi = Number(max)
  const pct = hi > lo ? ((value - lo) / (hi - lo)) * 100 : 0
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      className={cn(
        'h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4',
        '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent',
        '[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-surface',
        '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent',
        className,
      )}
      style={{
        background: `linear-gradient(to right, var(--accent) ${pct}%, var(--line-strong) ${pct}%)`,
        ...style,
      }}
      {...props}
    />
  )
}

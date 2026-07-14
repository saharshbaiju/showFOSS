import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full appearance-none rounded-lg bg-surface border border-line-strong',
          'h-9.5 pl-3 pr-9 text-sm text-ink transition-colors cursor-pointer',
          'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25',
          'disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
    </div>
  )
}

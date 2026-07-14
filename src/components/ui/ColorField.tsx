import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ColorFieldProps {
  value: string
  onChange: (value: string) => void
  presets?: string[]
  className?: string
}

export function ColorField({ value, onChange, presets = [], className }: ColorFieldProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((c) => {
            const active = c.toLowerCase() === value.toLowerCase()
            return (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => onChange(c)}
                className={cn(
                  'relative size-7 rounded-full transition-transform hover:scale-110 cursor-pointer',
                  active ? 'ring-2 ring-offset-2 ring-offset-surface ring-ink/40' : 'ring-1 ring-inset ring-black/10',
                )}
                style={{ backgroundColor: c }}
              >
                {active && <Check className="absolute inset-0 m-auto size-3.5 text-white mix-blend-difference" />}
              </button>
            )
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="relative size-9.5 shrink-0 overflow-hidden rounded-lg border border-line-strong">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 size-[calc(100%+1rem)] cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="font-data h-9.5 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm uppercase text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
      </div>
    </div>
  )
}

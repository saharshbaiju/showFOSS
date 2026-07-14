import { cn } from '@/lib/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:pointer-events-none',
        checked ? 'bg-accent' : 'bg-line-strong',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block size-4.5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-4.5' : 'translate-x-1',
        )}
      />
    </button>
  )
}

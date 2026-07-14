import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FieldProps {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  htmlFor?: string
  className?: string
  children: ReactNode
}

export function Field({ label, hint, error, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] text-live">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

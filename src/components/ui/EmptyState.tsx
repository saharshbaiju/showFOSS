import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong',
        'px-8 py-14 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

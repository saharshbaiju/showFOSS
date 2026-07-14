import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export function Card({ className, inset, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-surface border border-line shadow-soft',
        inset && 'p-5',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pt-5 pb-3', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />
}

export function SectionTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-sm font-semibold tracking-tight text-ink', className)}
      {...props}
    />
  )
}

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'font-data text-[11px] uppercase tracking-[0.14em] text-faint',
        className,
      )}
      {...props}
    />
  )
}

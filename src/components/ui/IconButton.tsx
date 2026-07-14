import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  tone?: 'default' | 'danger'
  children: ReactNode
}

const SIZES = {
  sm: 'h-8 w-8 rounded-lg [&_svg]:size-4',
  md: 'h-9.5 w-9.5 rounded-lg [&_svg]:size-[18px]',
  lg: 'h-11 w-11 rounded-xl [&_svg]:size-5',
}

export function IconButton({
  label,
  size = 'md',
  active = false,
  tone = 'default',
  className,
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center transition-colors duration-150 cursor-pointer',
        'disabled:opacity-40 disabled:pointer-events-none',
        SIZES[size],
        active
          ? 'bg-accent-soft text-accent'
          : tone === 'danger'
            ? 'text-muted hover:bg-live/10 hover:text-live'
            : 'text-muted hover:bg-canvas hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

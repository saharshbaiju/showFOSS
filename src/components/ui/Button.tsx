import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'subtle'
  | 'danger'
  | 'live'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-ink shadow-soft hover:brightness-110 active:brightness-95',
  secondary:
    'bg-surface text-ink border border-line-strong hover:bg-canvas active:bg-canvas',
  ghost: 'text-muted hover:bg-canvas hover:text-ink',
  subtle: 'bg-canvas text-ink hover:bg-line/70',
  danger: 'text-live hover:bg-live/10',
  live: 'bg-live text-white shadow-soft hover:brightness-110 active:brightness-95',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-lg gap-1.5',
  md: 'h-9.5 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-5 text-[15px] rounded-xl gap-2',
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}): string {
  return cn(
    'inline-flex items-center justify-center font-medium whitespace-nowrap',
    'transition-[filter,background-color,color,box-shadow] duration-150',
    'disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
    SIZES[size],
    VARIANTS[variant],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const baseField =
  'w-full rounded-lg bg-surface border border-line-strong px-3 text-sm text-ink ' +
  'placeholder:text-faint transition-colors ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 ' +
  'disabled:opacity-50'

export function Input({ className, type = 'text', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} className={cn(baseField, 'h-9.5', className)} {...props} />
}

export function Textarea({
  className,
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(baseField, 'py-2.5 resize-y leading-relaxed', className)}
      {...props}
    />
  )
}

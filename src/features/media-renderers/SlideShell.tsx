import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import type { ObjectFit } from '@/types'
import { cn } from '@/lib/cn'

/** Full-bleed stage container that centers a single slide's content. */
export function SlideShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}>
      {children}
    </div>
  )
}

export function fitClass(fit: ObjectFit | undefined): string {
  if (fit === 'cover') return 'object-cover'
  if (fit === 'fill') return 'object-fill'
  return 'object-contain'
}

export function SlideLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black/20">
      <Loader2 className="size-8 animate-spin text-white/60" />
    </div>
  )
}

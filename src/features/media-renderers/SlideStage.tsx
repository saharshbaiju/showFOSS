import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { MediaItem, SlideDirection, TransitionName } from '@/types'
import { getVariants } from '@/lib/transitions/registry'
import { cn } from '@/lib/cn'
import { MediaRenderer } from './MediaRenderer'

interface SlideStageProps {
  items: MediaItem[]
  currentIndex: number
  direction: SlideDirection
  /** Concrete transition (random already resolved by the engine). */
  transition: Exclude<TransitionName, 'random'>
  /** Transition animation length in seconds. */
  durationSec?: number
  onEnded?: () => void
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * A keep-alive slide surface. Each slide is mounted the first time it becomes
 * active and then STAYS mounted (hidden when inactive) — so a website or live
 * leaderboard never reloads when the show cycles back to it; it keeps its state
 * and only refreshes on its own auto-refresh interval. Transitions animate each
 * persistent layer between "center" (active) and "exit" (inactive) variants,
 * and inactive media is paused via the `active` prop.
 */
export function SlideStage({
  items,
  currentIndex,
  direction,
  transition,
  durationSec = 0.6,
  onEnded,
  className,
}: SlideStageProps) {
  const variants = getVariants(transition)
  const current = items[currentIndex]

  // Track which slides have been shown so we can keep them mounted afterwards.
  const [mounted, setMounted] = useState<Set<string>>(() => new Set())
  const knownIds = useRef<Set<string>>(new Set())
  knownIds.current = new Set(items.map((i) => i.id))

  useEffect(() => {
    if (!current) return
    setMounted((prev) => {
      // Add the newly-active slide; drop ids no longer in the playlist.
      const next = new Set([...prev].filter((id) => knownIds.current.has(id)))
      next.add(current.id)
      return next
    })
  }, [current])

  return (
    <div className={cn('relative h-full w-full overflow-hidden [perspective:1600px]', className)}>
      {items.map((item, i) => {
        const isActive = i === currentIndex
        if (!isActive && !mounted.has(item.id)) return null
        return (
          <motion.div
            key={item.id}
            className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d]"
            style={{ zIndex: isActive ? 2 : 1, pointerEvents: isActive ? 'auto' : 'none' }}
            custom={direction}
            variants={variants}
            initial="enter"
            animate={isActive ? 'center' : 'exit'}
            transition={{ duration: durationSec, ease: EASE }}
          >
            <MediaRenderer
              item={item}
              active={isActive}
              preview={false}
              onEnded={isActive ? onEnded : undefined}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

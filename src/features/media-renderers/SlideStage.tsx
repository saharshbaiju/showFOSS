import { AnimatePresence, motion } from 'framer-motion'
import type { MediaItem, SlideDirection, TransitionName } from '@/types'
import { getVariants } from '@/lib/transitions/registry'
import { cn } from '@/lib/cn'
import { MediaRenderer } from './MediaRenderer'

interface SlideStageProps {
  item: MediaItem | null
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
 * The animated single-slide surface. AnimatePresence keeps the entering and
 * exiting slides mounted together so fades cross-dissolve and slides pass each
 * other; `custom={direction}` feeds direction-aware variants.
 */
export function SlideStage({
  item,
  direction,
  transition,
  durationSec = 0.6,
  onEnded,
  className,
}: SlideStageProps) {
  const variants = getVariants(transition)
  return (
    <div className={cn('relative h-full w-full overflow-hidden [perspective:1600px]', className)}>
      <AnimatePresence custom={direction} initial={false}>
        {item && (
          <motion.div
            key={item.id}
            className="absolute inset-0 [backface-visibility:hidden] [transform-style:preserve-3d]"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: durationSec, ease: EASE }}
          >
            <MediaRenderer item={item} active preview={false} onEnded={onEnded} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

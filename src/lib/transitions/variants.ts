import type { Variants } from 'framer-motion'
import type { TransitionName } from '@/types'

type ConcreteTransition = Exclude<TransitionName, 'random'>

/**
 * Framer Motion variants keyed by transition name. Each has enter/center/exit
 * states; direction-aware ones read the AnimatePresence `custom` prop (1 = next,
 * -1 = prev). Adding a transition = adding one entry here.
 */
export const transitionVariants: Record<ConcreteTransition, Variants> = {
  fade: {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0.3 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d >= 0 ? '-100%' : '100%', opacity: 0.3 }),
  },
  zoom: {
    enter: { scale: 1.18, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 0.88, opacity: 0 },
  },
  scale: {
    enter: { scale: 0.82, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 1.06, opacity: 0 },
  },
  flip: {
    enter: { rotateY: 90, opacity: 0 },
    center: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  blur: {
    enter: { opacity: 0, filter: 'blur(22px)' },
    center: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(22px)' },
  },
  curtain: {
    enter: { clipPath: 'inset(0 0 100% 0)' },
    center: { clipPath: 'inset(0 0 0% 0)' },
    exit: { clipPath: 'inset(100% 0 0 0)' },
  },
  carousel: {
    enter: (d: number) => ({
      x: d >= 0 ? '100%' : '-100%',
      rotateY: d >= 0 ? 34 : -34,
      opacity: 0,
    }),
    center: { x: 0, rotateY: 0, opacity: 1 },
    exit: (d: number) => ({
      x: d >= 0 ? '-100%' : '100%',
      rotateY: d >= 0 ? -34 : 34,
      opacity: 0,
    }),
  },
  wave: {
    enter: { y: '45%', opacity: 0, skewY: 5 },
    center: { y: 0, opacity: 1, skewY: 0 },
    exit: { y: '-45%', opacity: 0, skewY: -5 },
  },
}

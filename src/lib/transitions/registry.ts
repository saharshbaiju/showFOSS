import type { Variants } from 'framer-motion'
import type { TransitionName } from '@/types'
import { CONCRETE_TRANSITIONS } from '@/types'
import { transitionVariants } from './variants'

type ConcreteTransition = Exclude<TransitionName, 'random'>

export function pickConcreteTransition(): ConcreteTransition {
  const i = Math.floor(Math.random() * CONCRETE_TRANSITIONS.length)
  return CONCRETE_TRANSITIONS[i]
}

/** Turn a (possibly "random") transition name into a concrete one. */
export function resolveTransitionName(name: TransitionName): ConcreteTransition {
  return name === 'random' ? pickConcreteTransition() : name
}

export function getVariants(name: ConcreteTransition): Variants {
  return transitionVariants[name]
}

/** Transitions that touch filter/clip-path — heavier on weak TV browsers. */
export const HEAVY_TRANSITIONS: ReadonlySet<TransitionName> = new Set(['blur', 'wave', 'curtain'])

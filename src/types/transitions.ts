export const TRANSITIONS = [
  'fade',
  'slide',
  'zoom',
  'scale',
  'flip',
  'blur',
  'curtain',
  'carousel',
  'wave',
  'random',
] as const

export type TransitionName = (typeof TRANSITIONS)[number]

/** Every transition except the meta "random" picker. */
export const CONCRETE_TRANSITIONS = TRANSITIONS.filter(
  (t): t is Exclude<TransitionName, 'random'> => t !== 'random',
)

export const TRANSITION_LABELS: Record<TransitionName, string> = {
  fade: 'Fade',
  slide: 'Slide',
  zoom: 'Zoom',
  scale: 'Scale',
  flip: 'Flip',
  blur: 'Blur',
  curtain: 'Curtain',
  carousel: 'Carousel',
  wave: 'Wave',
  random: 'Random',
}

export const DISPLAY_MODES = ['slideshow', 'grid', 'split', 'pip', 'random'] as const

export type DisplayMode = (typeof DISPLAY_MODES)[number]

export const DISPLAY_MODE_LABELS: Record<DisplayMode, string> = {
  slideshow: 'Slideshow',
  grid: 'Grid',
  split: 'Split screen',
  pip: 'Picture-in-picture',
  random: 'Random showcase',
}

export const GRID_SIZES = [2, 4, 6, 9] as const
export type GridSize = (typeof GRID_SIZES)[number]

/** Direction a transition travels, derived from next vs. prev navigation. */
export type SlideDirection = 1 | -1

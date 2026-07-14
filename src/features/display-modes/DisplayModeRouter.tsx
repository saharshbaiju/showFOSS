import type { ModeProps } from './types'
import { SlideshowMode } from './SlideshowMode'
import { GridMode } from './GridMode'
import { SplitMode } from './SplitMode'
import { PipMode } from './PipMode'

export function DisplayModeRouter({ api }: ModeProps) {
  switch (api.mode) {
    case 'grid':
      return <GridMode api={api} />
    case 'split':
      return <SplitMode api={api} />
    case 'pip':
      return <PipMode api={api} />
    case 'slideshow':
    case 'random':
    default:
      return <SlideshowMode api={api} />
  }
}

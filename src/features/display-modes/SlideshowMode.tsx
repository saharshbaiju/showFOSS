import type { ModeProps } from './types'
import { SlideStage } from '@/features/media-renderers'

/** Default single-slide show. Also serves Random showcase — the engine picks
 * random indices and transitions when mode is 'random'. */
export function SlideshowMode({ api }: ModeProps) {
  return (
    <SlideStage
      item={api.currentItem}
      direction={api.direction}
      transition={api.activeTransition}
      durationSec={api.transitionDuration}
      onEnded={api.onSlideEnded}
    />
  )
}

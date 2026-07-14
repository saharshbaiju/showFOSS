import type { ModeProps } from './types'
import { MediaRenderer, SlideStage } from '@/features/media-renderers'

/** A full-screen primary slide with the next item floating in the corner —
 * e.g. a leaderboard picture-in-picture over a poster. */
export function PipMode({ api }: ModeProps) {
  const pipItem = api.items.length > 1 ? api.items[(api.currentIndex + 1) % api.items.length] : null
  return (
    <div className="relative h-full w-full">
      <SlideStage
        item={api.currentItem}
        direction={api.direction}
        transition={api.activeTransition}
        durationSec={api.transitionDuration}
        onEnded={api.onSlideEnded}
      />
      {pipItem && (
        <div className="absolute bottom-6 right-6 aspect-video w-1/4 min-w-[220px] overflow-hidden rounded-xl border-2 border-white/25 bg-black shadow-pop">
          <MediaRenderer item={pipItem} active preview />
        </div>
      )}
    </div>
  )
}

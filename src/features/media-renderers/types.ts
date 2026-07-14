import type { MediaItem } from '@/types'

export interface SlideProps {
  item: MediaItem
  /** True when this slide is the one currently on screen (drives autoplay,
   * iframe refresh timers, etc). Grid/split render several actives at once. */
  active: boolean
  /** Presentation vs. editor preview. Preview is muted, non-interactive, and
   * avoids heavy work like live iframe refresh. */
  preview?: boolean
  /** Called by video/YouTube renderers when playback ends (advanceOnEnd). */
  onEnded?: () => void
}

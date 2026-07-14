import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MediaItem } from '@/types'
import type { ModeProps } from './types'
import { MediaRenderer } from '@/features/media-renderers'

/** One pane running its own independent slideshow loop. */
function usePaneCycle(items: MediaItem[], offset: number, playing: boolean): MediaItem | null {
  const [index, setIndex] = useState(offset)
  useEffect(() => {
    if (!playing || items.length === 0) return
    const item = items[index % items.length]
    const ms = Math.max(1, item?.duration ?? 12) * 1000
    const t = window.setTimeout(() => setIndex((i) => i + 1), ms)
    return () => window.clearTimeout(t)
  }, [index, playing, items])
  return items.length ? items[index % items.length] : null
}

function Pane({ items, offset, playing }: { items: MediaItem[]; offset: number; playing: boolean }) {
  const item = usePaneCycle(items, offset, playing)
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
      <AnimatePresence>
        {item && (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MediaRenderer item={item} active preview />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Two side-by-side panes, each cycling the playlist independently from a
 * different starting point — two shows at once. */
export function SplitMode({ api }: ModeProps) {
  const { items, isPlaying } = api
  const half = Math.floor(items.length / 2)
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2 p-2">
      <Pane items={items} offset={0} playing={isPlaying} />
      <Pane items={items} offset={half} playing={isPlaying} />
    </div>
  )
}

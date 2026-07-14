import { motion } from 'framer-motion'
import type { GridSize } from '@/types'
import type { ModeProps } from './types'
import { MediaRenderer } from '@/features/media-renderers'

const LAYOUT: Record<GridSize, { cols: number; rows: number }> = {
  2: { cols: 2, rows: 1 },
  4: { cols: 2, rows: 2 },
  6: { cols: 3, rows: 2 },
  9: { cols: 3, rows: 3 },
}

/** A page of `gridSize` cells starting at the playhead; auto-advance pages the
 * whole window (the engine's step equals gridSize in grid mode). Cells render
 * in preview mode (muted, no live refresh) to stay light with many at once. */
export function GridMode({ api }: ModeProps) {
  const { items, currentIndex, gridSize } = api
  const { cols, rows } = LAYOUT[gridSize]

  const cells = Array.from({ length: gridSize }, (_, k) =>
    items.length ? items[(currentIndex + k) % items.length] : undefined,
  )

  return (
    <div
      className="grid h-full w-full gap-2 p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((item, k) => (
        <motion.div
          key={`${item?.id ?? 'empty'}-${k}`}
          className="relative overflow-hidden rounded-xl bg-black ring-1 ring-white/10"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: k * 0.03, ease: [0.22, 1, 0.36, 1] }}
        >
          {item && <MediaRenderer item={item} active preview />}
        </motion.div>
      ))}
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  Columns2,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Pause,
  PictureInPicture2,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  SquarePlay,
  X,
} from 'lucide-react'
import type { DisplayMode, GridSize } from '@/types'
import { GRID_SIZES } from '@/types'
import { usePresentationStore } from '@/store/usePresentationStore'
import { SegmentedControl } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { PresentationApi } from './usePresentation'

const MODE_OPTIONS: { value: DisplayMode; label: React.ReactNode; title: string }[] = [
  { value: 'slideshow', label: <SquarePlay className="size-4" />, title: 'Slideshow' },
  { value: 'grid', label: <LayoutGrid className="size-4" />, title: 'Grid' },
  { value: 'split', label: <Columns2 className="size-4" />, title: 'Split screen' },
  { value: 'pip', label: <PictureInPicture2 className="size-4" />, title: 'Picture-in-picture' },
  { value: 'random', label: <Shuffle className="size-4" />, title: 'Random showcase' },
]

interface ControlsOverlayProps {
  api: PresentationApi
  visible: boolean
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onExit?: () => void
}

function ControlButton({
  onClick,
  label,
  children,
  primary,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors cursor-pointer',
        primary
          ? 'size-11 bg-white text-black hover:bg-white/90'
          : 'size-9 text-white/80 hover:bg-white/15 hover:text-white',
      )}
    >
      {children}
    </button>
  )
}

export function ControlsOverlay({
  api,
  visible,
  isFullscreen,
  onToggleFullscreen,
  onExit,
}: ControlsOverlayProps) {
  const setMode = usePresentationStore((s) => s.setMode)
  const setGridSize = usePresentationStore((s) => s.setGridSize)

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-5"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          'pointer-events-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-2xl',
          'bg-black/60 px-3 py-2 text-white shadow-pop ring-1 ring-white/10 backdrop-blur-xl',
        )}
      >
        {onExit && (
          <ControlButton onClick={onExit} label="Exit (Esc)">
            <X className="size-5" />
          </ControlButton>
        )}

        <div className="mx-1 flex items-center gap-1">
          <ControlButton onClick={api.prev} label="Previous (←)">
            <SkipBack className="size-5" />
          </ControlButton>
          <ControlButton onClick={api.togglePlay} label="Play / Pause (Space)" primary>
            {api.isPlaying ? <Pause className="size-5" /> : <Play className="size-5 translate-x-0.5" />}
          </ControlButton>
          <ControlButton onClick={api.next} label="Next (→)">
            <SkipForward className="size-5" />
          </ControlButton>
        </div>

        <span className="font-data mx-1 hidden text-sm tabular-nums text-white/70 sm:inline">
          {api.count === 0 ? '0 / 0' : `${api.currentIndex + 1} / ${api.count}`}
        </span>

        <div className="mx-1 h-6 w-px bg-white/15" />

        <SegmentedControl<DisplayMode>
          value={api.mode}
          onChange={setMode}
          options={MODE_OPTIONS}
          size="sm"
          className="border-white/15 bg-white/10"
        />

        {api.mode === 'grid' && (
          <SegmentedControl<GridSize>
            value={api.gridSize}
            onChange={setGridSize}
            options={GRID_SIZES.map((n) => ({ value: n, label: String(n) }))}
            size="sm"
            className="border-white/15 bg-white/10"
          />
        )}

        <ControlButton onClick={onToggleFullscreen} label="Fullscreen (F)">
          {isFullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
        </ControlButton>
      </div>
    </motion.div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import {
  CalendarClock,
  Columns2,
  LayoutGrid,
  Pause,
  PictureInPicture2,
  Play,
  Radio,
  Settings2,
  Shuffle,
  SquarePlay,
} from 'lucide-react'
import type { DisplayMode, GridSize } from '@/types'
import { GRID_SIZES } from '@/types'
import { selectEnabledItems, usePlaylistStore } from '@/store/usePlaylistStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useScheduleStore } from '@/store/useScheduleStore'
import {
  Badge,
  Button,
  Drawer,
  IconButton,
  Modal,
  SegmentedControl,
  buttonVariants,
} from '@/components/ui'
import { BrandMark, Wordmark } from '@/components/brand/BrandMark'
import { PlaylistManager } from '@/features/playlist'
import { PresentationPlayer } from '@/features/presentation'
import { SettingsPanel } from '@/features/settings'
import { ScheduleEditor } from '@/features/schedule'
import { cn } from '@/lib/cn'

const MODE_OPTIONS: { value: DisplayMode; label: React.ReactNode; title: string }[] = [
  { value: 'slideshow', label: <SquarePlay className="size-4" />, title: 'Slideshow' },
  { value: 'grid', label: <LayoutGrid className="size-4" />, title: 'Grid' },
  { value: 'split', label: <Columns2 className="size-4" />, title: 'Split screen' },
  { value: 'pip', label: <PictureInPicture2 className="size-4" />, title: 'Picture-in-picture' },
  { value: 'random', label: <Shuffle className="size-4" />, title: 'Random showcase' },
]

function formatRuntime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function LivePreview() {
  const mode = usePresentationStore((s) => s.mode)
  const gridSize = usePresentationStore((s) => s.gridSize)
  const isPlaying = usePresentationStore((s) => s.isPlaying)
  const currentIndex = usePresentationStore((s) => s.currentIndex)
  const setMode = usePresentationStore((s) => s.setMode)
  const setGridSize = usePresentationStore((s) => s.setGridSize)
  const togglePlay = usePresentationStore((s) => s.togglePlay)

  const enabled = usePlaylistStore(useShallow(selectEnabledItems))
  const current = enabled.length ? enabled[Math.min(currentIndex, enabled.length - 1)] : null
  const runtime = enabled.reduce((sum, i) => sum + i.duration, 0)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5 items-center justify-center">
            <span
              className={cn(
                'size-2.5 rounded-full',
                isPlaying ? 'live-dot bg-live' : 'bg-faint',
              )}
            />
          </span>
          <span className="font-data text-[11px] uppercase tracking-[0.14em] text-muted">
            {isPlaying ? 'On air preview' : 'Preview'}
          </span>
        </div>
        <SegmentedControl<DisplayMode>
          value={mode}
          onChange={setMode}
          options={MODE_OPTIONS}
          size="sm"
        />
      </div>

      {/* The signature: an on-air monitor showing the show live. */}
      <div className="relative overflow-hidden rounded-2xl bg-black p-1.5 shadow-lift ring-1 ring-black/10">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <PresentationPlayer preview autoStart />
        </div>
      </div>

      {mode === 'grid' && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-[13px] text-muted">Cells</span>
          <SegmentedControl<GridSize>
            value={gridSize}
            onChange={setGridSize}
            options={GRID_SIZES.map((n) => ({ value: n, label: String(n) }))}
            size="sm"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <IconButton
          label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
          className="bg-canvas"
        >
          {isPlaying ? <Pause /> : <Play />}
        </IconButton>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {current ? current.title : 'Nothing to show yet'}
          </p>
          <p className="font-data text-xs text-muted">
            {enabled.length} slide{enabled.length === 1 ? '' : 's'} · {formatRuntime(runtime)} loop
          </p>
        </div>
        <Link
          to="/present"
          className={buttonVariants({ variant: 'live', size: 'lg' })}
          aria-disabled={enabled.length === 0}
        >
          <Radio className="size-4" />
          Go live
        </Link>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const scheduleEnabled = useScheduleStore((s) => s.enabled)

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2.5">
          <BrandMark className="size-7 text-ink" />
          <Wordmark />
          <span className="ml-2 hidden text-[13px] text-muted md:inline">Show everything. Beautifully.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setScheduleOpen(true)}>
            <CalendarClock className="size-4" />
            <span className="hidden sm:inline">Schedule</span>
            {scheduleEnabled && <Badge tone="accent">On</Badge>}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
            <Settings2 className="size-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Link to="/present" className={buttonVariants({ variant: 'live', size: 'sm', className: 'ml-1' })}>
            <Radio className="size-4" />
            Go live
          </Link>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(380px,44%)_1fr] lg:gap-5 lg:p-5">
        <section className="min-h-0 rounded-2xl border border-line bg-surface p-4 shadow-soft">
          <PlaylistManager />
        </section>
        <section className="min-h-0 rounded-2xl border border-line bg-surface p-4 shadow-soft lg:p-6">
          <LivePreview />
        </section>
      </main>

      <Drawer open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings" width={480}>
        <SettingsPanel />
      </Drawer>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule"
        description="Map slides to times of day. During a show, the schedule takes over."
        size="md"
      >
        <ScheduleEditor />
      </Modal>
    </div>
  )
}

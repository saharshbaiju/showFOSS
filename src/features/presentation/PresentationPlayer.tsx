import { useEffect, useRef } from 'react'
import { MonitorPlay } from 'lucide-react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useFullscreen } from '@/lib/hooks/useFullscreen'
import { useIdleCursor } from '@/lib/hooks/useIdleCursor'
import { useKeyboardShortcuts } from '@/lib/keyboard/shortcuts'
import { DisplayModeRouter } from '@/features/display-modes'
import { WidgetLayer } from '@/features/widgets'
import { readableTextOn } from '@/lib/color'
import { cn } from '@/lib/cn'
import { usePresentation } from './usePresentation'
import { ProgressBar } from './ProgressBar'
import { ControlsOverlay } from './ControlsOverlay'

interface PresentationPlayerProps {
  /** Small embedded preview (compact widgets, always-muted media). */
  preview?: boolean
  /** Wire keyboard shortcuts, fullscreen, and cursor auto-hide. */
  interactive?: boolean
  showControls?: boolean
  autoStart?: boolean
  onExit?: () => void
  className?: string
}

function EmptyStage({ preview, color }: { preview: boolean; color: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3" style={{ color }}>
      <MonitorPlay className={preview ? 'size-7 opacity-40' : 'size-12 opacity-40'} />
      <p className={cn('font-medium opacity-70', preview ? 'text-sm' : 'text-lg')}>
        No slides to show yet
      </p>
      {!preview && <p className="text-sm opacity-40">Add media to your playlist to begin.</p>}
    </div>
  )
}

export function PresentationPlayer({
  preview = false,
  interactive = false,
  showControls = false,
  autoStart = false,
  onExit,
  className,
}: PresentationPlayerProps) {
  const api = usePresentation()
  const containerRef = useRef<HTMLDivElement>(null)
  const presentationBg = useSettingsStore((s) => s.theme.presentationBg)
  const showProgress = useSettingsStore((s) => s.playback.showProgress)
  const controlsEnabled = useSettingsStore((s) => s.playback.showControls)
  const fullscreen = useFullscreen(containerRef)
  const idle = useIdleCursor(interactive, 3000)

  useEffect(() => {
    if (autoStart) usePresentationStore.getState().reset(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useKeyboardShortcuts(
    {
      onExit,
      onTogglePlay: api.togglePlay,
      onPrev: api.prev,
      onNext: api.next,
      onFullscreen: fullscreen.toggle,
    },
    interactive,
  )

  // The floating bar only exists when this surface allows it AND the user
  // hasn't turned controls off — so with it off, moving the mouse does nothing.
  const controlsBar = showControls && controlsEnabled
  const controlsVisible = controlsBar && !(interactive && idle)
  const singleSlide = api.mode !== 'grid' && api.mode !== 'split'

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-full w-full overflow-hidden',
        interactive && idle && 'cursor-none',
        className,
      )}
      style={{ backgroundColor: presentationBg }}
    >
      {api.count === 0 ? (
        <EmptyStage preview={preview} color={readableTextOn(presentationBg)} />
      ) : (
        <>
          <DisplayModeRouter api={api} />
          <WidgetLayer compact={preview} />
          {showProgress && !preview && singleSlide && (
            <ProgressBar index={api.currentIndex} count={api.count} />
          )}
        </>
      )}

      {controlsBar && (
        <ControlsOverlay
          api={api}
          visible={controlsVisible}
          isFullscreen={fullscreen.isFullscreen}
          onToggleFullscreen={fullscreen.toggle}
          onExit={onExit}
        />
      )}
    </div>
  )
}

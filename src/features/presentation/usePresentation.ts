import { useCallback, useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { MediaItem, SlideDirection } from '@/types'
import { selectEnabledItems, usePlaylistStore } from '@/store/usePlaylistStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useScheduleStore } from '@/store/useScheduleStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import { resolveTransitionName } from '@/lib/transitions/registry'
import { useNow } from '@/lib/time/clock'
import { resolveActiveScheduleEntry } from '@/lib/time/schedule'

/**
 * The playback engine. Composes the enabled playlist, playback settings, and
 * schedule into a single controllable presentation: it advances slides on their
 * per-item duration, resolves the (possibly random) transition for each slide,
 * lets the schedule take over the screen, and exposes next/prev/toggle so
 * keyboard shortcuts and on-screen controls share one source of truth.
 */
export function usePresentation() {
  const items = usePlaylistStore(useShallow(selectEnabledItems))
  const playback = useSettingsStore((s) => s.playback)
  const scheduleEnabled = useScheduleStore((s) => s.enabled)
  const scheduleEntries = useScheduleStore((s) => s.entries)

  const mode = usePresentationStore((s) => s.mode)
  const gridSize = usePresentationStore((s) => s.gridSize)
  const currentIndex = usePresentationStore((s) => s.currentIndex)
  const direction = usePresentationStore((s) => s.direction)
  const isPlaying = usePresentationStore((s) => s.isPlaying)
  // NB: progress is intentionally NOT subscribed here — it updates every frame,
  // so only ProgressBar reads it directly to avoid re-rendering the whole stage.
  const activeTransition = usePresentationStore((s) => s.activeTransition)
  const scheduleActive = usePresentationStore((s) => s.scheduleActive)

  const goTo = usePresentationStore((s) => s.goTo)
  const setPlaying = usePresentationStore((s) => s.setPlaying)
  const togglePlay = usePresentationStore((s) => s.togglePlay)
  const setProgress = usePresentationStore((s) => s.setProgress)
  const setActiveTransition = usePresentationStore((s) => s.setActiveTransition)
  const setScheduleActive = usePresentationStore((s) => s.setScheduleActive)

  const count = items.length
  const safeIndex = count > 0 ? Math.min(currentIndex, count - 1) : 0
  const currentItem: MediaItem | null = count > 0 ? items[safeIndex] : null

  // How far the playhead jumps: grid pages by a full screen of cells.
  const step = mode === 'grid' ? gridSize : 1

  // Resolve a slide's transition (per-item override → default; random → concrete).
  const resolveFor = useCallback(
    (item: MediaItem | undefined) => {
      if (mode === 'random') return resolveTransitionName('random')
      const name = item?.transition ?? playback.transition
      return resolveTransitionName(name)
    },
    [mode, playback.transition],
  )

  const goToIndex = useCallback(
    (index: number, dir: SlideDirection) => {
      setActiveTransition(resolveFor(items[index]))
      goTo(index, dir)
    },
    [items, resolveFor, setActiveTransition, goTo],
  )

  const next = useCallback(() => {
    if (count === 0) return
    if (mode === 'random') {
      if (count === 1) return goToIndex(0, 1)
      let r = safeIndex
      while (r === safeIndex) r = Math.floor(Math.random() * count)
      return goToIndex(r, 1)
    }
    const atEnd = safeIndex + step >= count
    if (atEnd && !playback.loop) {
      setPlaying(false)
      return
    }
    if (atEnd && playback.shuffleOnLoop) usePlaylistStore.getState().shuffleOrder()
    const nextIndex = atEnd ? 0 : safeIndex + step
    goToIndex(nextIndex, 1)
  }, [count, mode, safeIndex, step, playback.loop, playback.shuffleOnLoop, goToIndex, setPlaying])

  const prev = useCallback(() => {
    if (count === 0) return
    const atStart = safeIndex - step < 0
    const prevIndex = atStart ? Math.max(0, count - step) : safeIndex - step
    goToIndex(prevIndex, -1)
  }, [count, safeIndex, step, goToIndex])

  // Stable ref so timers/handlers always call the latest next().
  const nextRef = useRef(next)
  nextRef.current = next

  const onSlideEnded = useCallback(() => {
    if (isPlaying && !scheduleActive) nextRef.current()
  }, [isPlaying, scheduleActive])

  // Keep the resolved transition sane on first mount / when the list changes.
  useEffect(() => {
    if (currentItem) setActiveTransition(resolveFor(currentItem))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-advance + progress. Video/YouTube with advanceOnEnd advance on their
  // own 'ended' event instead of the timer. Schedule suspends the timer.
  const advanceOnEnd =
    !!currentItem?.advanceOnEnd &&
    (currentItem.type === 'video' || currentItem.type === 'youtube')

  useEffect(() => {
    if (!isPlaying || scheduleActive || !currentItem || advanceOnEnd) return
    const durationMs = Math.max(1, currentItem.duration) * 1000
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs)
      setProgress(p)
      if (p >= 1) nextRef.current()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, scheduleActive, safeIndex, currentItem, advanceOnEnd, setProgress])

  // Schedule override: when an entry's window is active, jump to it and hold.
  const now = useNow(1000)
  useEffect(() => {
    if (!scheduleEnabled) {
      if (scheduleActive) setScheduleActive(false)
      return
    }
    const entry = resolveActiveScheduleEntry(now, scheduleEntries)
    if (!entry) {
      if (scheduleActive) setScheduleActive(false)
      return
    }
    const idx = items.findIndex((i) => i.id === entry.itemId)
    if (idx < 0) {
      if (scheduleActive) setScheduleActive(false)
      return
    }
    if (!scheduleActive) setScheduleActive(true)
    if (idx !== safeIndex) goToIndex(idx, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, scheduleEnabled, scheduleEntries, items])

  return {
    items,
    count,
    currentItem,
    currentIndex: safeIndex,
    direction,
    isPlaying,
    mode,
    gridSize,
    activeTransition,
    scheduleActive,
    transitionDuration: playback.transitionDuration,
    next,
    prev,
    togglePlay,
    setPlaying,
    goToIndex,
    onSlideEnded,
  }
}

export type PresentationApi = ReturnType<typeof usePresentation>

import { create } from 'zustand'
import type {
  DisplayMode,
  GridSize,
  SlideDirection,
  TransitionName,
} from '@/types'

type ConcreteTransition = Exclude<TransitionName, 'random'>

/**
 * Ephemeral runtime state for playback. Deliberately NOT persisted: a refresh
 * or crash should never restart a show mid-slide, and the editor and the
 * /present tab shouldn't fight over playhead state. Content and config come
 * from the persisted stores; this holds only the playhead.
 */
interface PresentationState {
  mode: DisplayMode
  gridSize: GridSize
  currentIndex: number
  direction: SlideDirection
  isPlaying: boolean
  /** 0..1 progress of the current slide, for the progress bar. */
  progress: number
  /** Concrete transition currently in play (random resolved to a real one). */
  activeTransition: ConcreteTransition
  /** True while the schedule is driving the screen (suspends auto-advance). */
  scheduleActive: boolean

  setMode: (mode: DisplayMode) => void
  setGridSize: (size: GridSize) => void
  setPlaying: (playing: boolean) => void
  togglePlay: () => void
  setProgress: (progress: number) => void
  setActiveTransition: (t: ConcreteTransition) => void
  setScheduleActive: (active: boolean) => void
  goTo: (index: number, direction?: SlideDirection) => void
  reset: (autoPlay: boolean) => void
}

export const usePresentationStore = create<PresentationState>((set) => ({
  mode: 'slideshow',
  gridSize: 4,
  currentIndex: 0,
  direction: 1,
  isPlaying: false,
  progress: 0,
  activeTransition: 'fade',
  scheduleActive: false,

  setMode: (mode) => set({ mode }),
  setGridSize: (gridSize) => set({ gridSize }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setProgress: (progress) => set({ progress }),
  setActiveTransition: (activeTransition) => set({ activeTransition }),
  setScheduleActive: (scheduleActive) => set({ scheduleActive }),
  goTo: (index, direction = 1) => set({ currentIndex: index, direction, progress: 0 }),
  reset: (autoPlay) => set({ currentIndex: 0, progress: 0, isPlaying: autoPlay, direction: 1 }),
}))

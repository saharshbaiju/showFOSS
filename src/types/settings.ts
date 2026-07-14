import type { TransitionName } from './transitions'
import type { WidgetSettings } from './widgets'

export type ThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  /** App chrome theme. Presentation stage uses its own background. */
  mode: ThemeMode
  /** Hex accent that drives the --accent custom property. */
  accent: string
  /** Background painted behind slides during presentation. */
  presentationBg: string
}

export interface PlaybackDefaults {
  transition: TransitionName
  /** Length of the transition animation itself, in seconds. */
  transitionDuration: number
  /** Default seconds per slide for new items. */
  duration: number
  loop: boolean
  autoPlay: boolean
  /** Reshuffle order each time the playlist loops. */
  shuffleOnLoop: boolean
  /** Show progress bar during presentation. */
  showProgress: boolean
}

export interface AppSettings {
  theme: ThemeConfig
  playback: PlaybackDefaults
  widgets: WidgetSettings
}

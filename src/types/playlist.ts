import type { MediaItem } from './media'
import type { AppSettings } from './settings'
import type { ScheduleEntry } from './schedule'

/** Shape of an exported/imported .json file. */
export interface PlaylistBundle {
  app: 'showfoss'
  version: number
  exportedAt: number
  name?: string
  items: MediaItem[]
  order: string[]
  settings?: AppSettings
  schedule?: {
    enabled: boolean
    entries: ScheduleEntry[]
  }
}

export const BUNDLE_VERSION = 1

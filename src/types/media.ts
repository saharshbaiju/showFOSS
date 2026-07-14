import type { TransitionName } from './transitions'

export const MEDIA_TYPES = [
  'website',
  'image',
  'video',
  'youtube',
  'pdf',
  'markdown',
] as const

export type MediaType = (typeof MEDIA_TYPES)[number]

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  website: 'Website',
  image: 'Image',
  video: 'Video',
  youtube: 'YouTube',
  pdf: 'PDF',
  markdown: 'Announcement',
}

/**
 * How the bytes for an item are located.
 * - `url`    → a remote/external URL (websites, hosted images/videos, YouTube).
 * - `idb`    → an uploaded blob living in IndexedDB, referenced by key.
 * - `inline` → small text stored directly in LocalStorage (markdown copy).
 */
export type MediaSource =
  | { kind: 'url'; url: string }
  | { kind: 'idb'; ref: string; mime: string; size: number; fileName?: string }
  | { kind: 'inline'; text: string }

export type ObjectFit = 'contain' | 'cover' | 'fill'

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  source: MediaSource
  enabled: boolean
  /** Seconds this slide stays on screen (ignored when advanceOnEnd wins). */
  duration: number
  /** Per-item transition override; falls back to the global default. */
  transition?: TransitionName
  fit?: ObjectFit
  /** Websites: seconds between silent reloads (keeps live boards fresh). 0 = off. */
  refreshInterval?: number
  /** Video / YouTube: advance when playback ends instead of on the timer. */
  advanceOnEnd?: boolean
  /** Video / YouTube: start muted (required for reliable autoplay). */
  muted?: boolean
  /** Small data-URL preview generated at add time, when we can make one. */
  thumbnail?: string
  createdAt: number
}

export const DEFAULT_DURATION = 12

import type {
  AppSettings,
  MediaItem,
  PlaylistBundle,
  ScheduleEntry,
} from '@/types'
import { BUNDLE_VERSION } from '@/types'

export interface BundleInput {
  items: MediaItem[]
  order: string[]
  settings?: AppSettings
  schedule?: { enabled: boolean; entries: ScheduleEntry[] }
  name?: string
}

export function buildBundle(input: BundleInput): PlaylistBundle {
  return {
    app: 'showfoss',
    version: BUNDLE_VERSION,
    exportedAt: Date.now(),
    name: input.name,
    items: input.items,
    order: input.order,
    settings: input.settings,
    schedule: input.schedule,
  }
}

/** Serialize a bundle and trigger a browser download. */
export function downloadBundle(bundle: PlaylistBundle): void {
  const json = JSON.stringify(bundle, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const stamp = new Date(bundle.exportedAt).toISOString().slice(0, 10)
  a.download = `showfoss-playlist-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export interface ParsedBundle {
  items: MediaItem[]
  order: string[]
  settings?: AppSettings
  schedule?: { enabled: boolean; entries: ScheduleEntry[] }
  /** Items whose bytes live in IndexedDB and won't be present after import. */
  unresolvedCount: number
}

/** Validate and normalize a raw JSON string into an importable bundle. */
export function parseBundle(raw: string): ParsedBundle {
  let data: Partial<PlaylistBundle>
  try {
    data = JSON.parse(raw) as Partial<PlaylistBundle>
  } catch {
    throw new Error("That file isn't valid JSON.")
  }
  if (data.app !== 'showfoss' || !Array.isArray(data.items)) {
    throw new Error("That file isn't a showFOSS playlist.")
  }

  const items = data.items as MediaItem[]
  const known = new Set(items.map((i) => i.id))
  const order =
    Array.isArray(data.order) && data.order.length
      ? (data.order as string[]).filter((id) => known.has(id))
      : items.map((i) => i.id)
  for (const item of items) if (!order.includes(item.id)) order.push(item.id)

  const unresolvedCount = items.filter((i) => i.source?.kind === 'idb').length

  return {
    items,
    order,
    settings: data.settings,
    schedule: data.schedule,
    unresolvedCount,
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsText(file)
  })
}

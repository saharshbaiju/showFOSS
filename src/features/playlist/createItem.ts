import type { MediaItem, MediaType } from '@/types'
import { uid } from '@/lib/id'
import {
  detectTypeFromFile,
  detectTypeFromUrl,
  hostnameOf,
  normalizeUrl,
} from '@/lib/media/detectType'
import { parseYouTubeId, youTubeThumbnail } from '@/lib/media/youtube'
import { putBlob } from '@/lib/storage/mediaStore'
import { makeImageThumbnail, makeVideoThumbnail } from '@/lib/media/thumbnail'
import { useSettingsStore } from '@/store/useSettingsStore'

function playbackDefaults() {
  return useSettingsStore.getState().playback
}

function baseItem(type: MediaType, title: string): Omit<MediaItem, 'source'> {
  return {
    id: uid('m'),
    type,
    title: title.trim() || 'Untitled',
    enabled: true,
    duration: playbackDefaults().duration,
    fit: 'contain',
    createdAt: Date.now(),
  }
}

function stripExt(name: string): string {
  return name.replace(/\.[^./\\]+$/, '')
}

function titleFromUrl(type: MediaType, url: string): string {
  if (type === 'youtube') return 'YouTube video'
  if (type === 'website') return hostnameOf(url)
  try {
    const path = new URL(url).pathname.split('/').filter(Boolean).pop()
    return path ? stripExt(decodeURIComponent(path)) : hostnameOf(url)
  } catch {
    return hostnameOf(url)
  }
}

/** Build an item from a pasted URL (website / hosted media / YouTube). */
export function itemFromUrl(rawUrl: string, titleOverride?: string): MediaItem {
  const url = normalizeUrl(rawUrl)
  const type = detectTypeFromUrl(url)
  const base = baseItem(type, titleOverride ?? titleFromUrl(type, url))

  let thumbnail: string | undefined
  if (type === 'youtube') {
    const id = parseYouTubeId(url)
    if (id) thumbnail = youTubeThumbnail(id)
  }

  return {
    ...base,
    source: { kind: 'url', url },
    thumbnail,
    refreshInterval: type === 'website' ? 0 : undefined,
    advanceOnEnd: type === 'video' || type === 'youtube' ? false : undefined,
    muted: type === 'video' || type === 'youtube' ? true : undefined,
  }
}

/** Build an item from an uploaded file; blob goes to IndexedDB. Returns null
 * for unsupported files. */
export async function itemFromFile(file: File): Promise<MediaItem | null> {
  const type = detectTypeFromFile(file)
  if (!type) return null

  if (type === 'markdown') {
    const text = await file.text()
    return itemFromText(stripExt(file.name), text)
  }

  const ref = uid('blob')
  await putBlob(ref, file)

  let thumbnail: string | undefined
  if (type === 'image') thumbnail = await makeImageThumbnail(file)
  else if (type === 'video') thumbnail = await makeVideoThumbnail(file)

  return {
    ...baseItem(type, stripExt(file.name)),
    source: {
      kind: 'idb',
      ref,
      mime: file.type || 'application/octet-stream',
      size: file.size,
      fileName: file.name,
    },
    thumbnail,
    advanceOnEnd: type === 'video' ? false : undefined,
    muted: type === 'video' ? true : undefined,
  }
}

/** Build a Markdown announcement item (text stored inline in LocalStorage). */
export function itemFromText(title: string, text: string): MediaItem {
  return {
    ...baseItem('markdown', title || 'Announcement'),
    source: { kind: 'inline', text },
  }
}

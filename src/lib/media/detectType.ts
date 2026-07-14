import type { MediaType } from '@/types'
import { parseYouTubeId } from './youtube'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp)(\?.*)?(#.*)?$/i
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?(#.*)?$/i
const PDF_EXT = /\.pdf(\?.*)?(#.*)?$/i

/** Best guess at a media type from a URL string. Defaults to `website`. */
export function detectTypeFromUrl(url: string): MediaType {
  if (parseYouTubeId(url)) return 'youtube'
  if (IMAGE_EXT.test(url)) return 'image'
  if (VIDEO_EXT.test(url)) return 'video'
  if (PDF_EXT.test(url)) return 'pdf'
  return 'website'
}

/** Media type for an uploaded file, or null if unsupported. */
export function detectTypeFromFile(file: File): MediaType | null {
  const mime = file.type
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('text/')) return 'markdown'

  const name = file.name
  if (IMAGE_EXT.test(name)) return 'image'
  if (VIDEO_EXT.test(name)) return 'video'
  if (PDF_EXT.test(name)) return 'pdf'
  if (/\.(md|markdown|txt)$/i.test(name)) return 'markdown'
  return null
}

export function looksLikeUrl(s: string): boolean {
  const t = s.trim()
  if (!t || /\s/.test(t)) return false
  return /^https?:\/\//i.test(t) || /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(t)
}

export function normalizeUrl(s: string): string {
  const t = s.trim()
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

export function hostnameOf(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

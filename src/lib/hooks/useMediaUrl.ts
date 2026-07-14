import { useEffect, useState } from 'react'
import type { MediaSource } from '@/types'
import { getObjectUrl } from '@/lib/storage/mediaStore'

/**
 * Resolve a MediaSource to something an <img>/<video>/<iframe> can load.
 * URL sources pass through; IndexedDB sources resolve to a cached object URL.
 * Object URLs are owned by mediaStore (revoked on delete), so we don't revoke
 * here — the same URL is reused across renders and slides.
 */
export function useMediaUrl(source: MediaSource | undefined): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    source?.kind === 'url' ? source.url : null,
  )

  useEffect(() => {
    let cancelled = false
    if (!source) {
      setUrl(null)
      return
    }
    if (source.kind === 'url') {
      setUrl(source.url)
      return
    }
    if (source.kind === 'idb') {
      setUrl(null)
      void getObjectUrl(source.ref).then((resolved) => {
        if (!cancelled) setUrl(resolved)
      })
    }
    return () => {
      cancelled = true
    }
  }, [source])

  return url
}

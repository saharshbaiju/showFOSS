import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { SlideProps } from './types'
import { EmbedBlockedFallback } from './EmbedBlockedFallback'

/**
 * Embeds a website via iframe with auto-refresh (for live leaderboards) and a
 * best-effort block detector. Note: X-Frame-Options / CSP frame-ancestors
 * blocks can't be reliably detected from the parent (same-origin policy hides
 * the frame's content, and onload fires even for the browser's block page). So
 * we combine a load timeout with an always-present "open in new tab" affordance
 * — the user is never stuck, even when detection guesses wrong.
 */
export function WebsiteFrame({ item, active, preview }: SlideProps) {
  const url = item.source.kind === 'url' ? item.source.url : ''
  const [loaded, setLoaded] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const loadedRef = useRef(false)

  // Reset + arm the timeout on each (re)load.
  useEffect(() => {
    setLoaded(false)
    setTimedOut(false)
    loadedRef.current = false
    const t = window.setTimeout(() => {
      if (!loadedRef.current) setTimedOut(true)
    }, 5000)
    return () => window.clearTimeout(t)
  }, [url, refreshKey])

  // Silent auto-refresh keeps live boards fresh (remount the iframe by key).
  useEffect(() => {
    if (!active || preview) return
    const seconds = item.refreshInterval ?? 0
    if (seconds <= 0) return
    const id = window.setInterval(() => setRefreshKey((k) => k + 1), seconds * 1000)
    return () => window.clearInterval(id)
  }, [active, preview, item.refreshInterval])

  if (!url) return null

  return (
    <div className="relative h-full w-full bg-white">
      <iframe
        key={refreshKey}
        src={url}
        title={item.title}
        className="h-full w-full border-0"
        referrerPolicy="no-referrer-when-downgrade"
        allow="autoplay; fullscreen; clipboard-read; clipboard-write"
        onLoad={() => {
          loadedRef.current = true
          setLoaded(true)
        }}
      />

      {/* Always-available escape hatch. */}
      {!preview && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-opacity hover:bg-black/70"
        >
          <ExternalLink className="size-3.5" />
          Open
        </a>
      )}

      {timedOut && !loaded && (
        <EmbedBlockedFallback url={url} onRetry={() => setRefreshKey((k) => k + 1)} />
      )}
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { MonitorPlay } from 'lucide-react'
import type { SlideProps } from './types'
import { parseYouTubeId } from '@/lib/media/youtube'

let apiPromise: Promise<void> | null = null

/** Load the YouTube IFrame Player API once, resolving when YT is ready. */
function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return apiPromise
}

/**
 * Renders a YouTube video through the official IFrame Player API for full
 * control: muted autoplay (required by browsers), loop, and — when
 * advanceOnEnd is set — advancing the show when the video ends. The player is
 * mounted into a detached child element so YouTube's DOM swaps never fight
 * React's reconciliation.
 */
export function YouTubeSlide({ item, active, preview, onEnded }: SlideProps) {
  const id = item.source.kind === 'url' ? parseYouTubeId(item.source.url) : null
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const onEndedRef = useRef(onEnded)
  onEndedRef.current = onEnded

  const autoplay = active && !preview
  const muted = preview ? true : (item.muted ?? true)
  const loop = !item.advanceOnEnd

  useEffect(() => {
    const container = containerRef.current
    if (!id || !container) return
    let cancelled = false
    let player: YTPlayer | null = null

    const mount = document.createElement('div')
    mount.style.width = '100%'
    mount.style.height = '100%'
    container.appendChild(mount)

    void loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return
      player = new window.YT.Player(mount, {
        videoId: id,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          mute: muted ? 1 : 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          loop: loop ? 1 : 0,
          playlist: loop ? id : '',
          iv_load_policy: 3,
        },
        events: {
          onStateChange: (event) => {
            if (window.YT && event.data === window.YT.PlayerState.ENDED) onEndedRef.current?.()
          },
        },
      })
      playerRef.current = player
    })

    return () => {
      cancelled = true
      try {
        player?.destroy()
      } catch {
        /* ignore */
      }
      playerRef.current = null
      container.innerHTML = ''
    }
    // Recreate when the video or its playback config changes.
  }, [id, loop, muted]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause as this slide becomes active, without recreating the player.
  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    try {
      if (autoplay) player.playVideo()
      else player.pauseVideo()
    } catch {
      /* ignore */
    }
  }, [autoplay])

  if (!id) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black text-white/60">
        <MonitorPlay className="size-8" />
        <p className="text-sm">Invalid YouTube link</p>
      </div>
    )
  }

  return <div ref={containerRef} className="h-full w-full bg-black [&_iframe]:h-full [&_iframe]:w-full" />
}

import { useEffect, useRef } from 'react'
import type { SlideProps } from './types'
import { useMediaUrl } from '@/lib/hooks/useMediaUrl'
import { fitClass, SlideLoading } from './SlideShell'
import { cn } from '@/lib/cn'

export function VideoSlide({ item, active, preview, onEnded }: SlideProps) {
  const url = useMediaUrl(item.source)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active && !preview) {
      video.currentTime = 0
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active, preview, url])

  if (!url) return <SlideLoading />

  return (
    <video
      ref={ref}
      src={url}
      className={cn('h-full w-full', fitClass(item.fit))}
      autoPlay={active && !preview}
      // muted is required for reliable autoplay; preview is always silent.
      muted={preview ? true : (item.muted ?? true)}
      loop={!item.advanceOnEnd}
      playsInline
      onEnded={() => {
        if (item.advanceOnEnd) onEnded?.()
      }}
    />
  )
}

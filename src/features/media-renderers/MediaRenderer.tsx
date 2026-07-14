import { Suspense, lazy, type ComponentType } from 'react'
import type { MediaType } from '@/types'
import type { SlideProps } from './types'
import { SlideLoading, SlideShell } from './SlideShell'
import { WebsiteFrame } from './WebsiteFrame'
import { ImageSlide } from './ImageSlide'
import { VideoSlide } from './VideoSlide'
import { YouTubeSlide } from './YouTubeSlide'
import { PdfSlide } from './PdfSlide'

// react-markdown is heavy; only load it when an announcement is on screen.
const MarkdownSlide = lazy(() =>
  import('./MarkdownSlide').then((m) => ({ default: m.MarkdownSlide })),
)

/** Per-type renderer registry. Adding a media type = one entry + one component. */
const RENDERERS: Record<MediaType, ComponentType<SlideProps>> = {
  website: WebsiteFrame,
  image: ImageSlide,
  video: VideoSlide,
  youtube: YouTubeSlide,
  pdf: PdfSlide,
  markdown: MarkdownSlide,
}

export function MediaRenderer(props: SlideProps) {
  const Renderer = RENDERERS[props.item.type]
  return (
    <SlideShell>
      <Suspense fallback={<SlideLoading />}>
        <Renderer {...props} />
      </Suspense>
    </SlideShell>
  )
}

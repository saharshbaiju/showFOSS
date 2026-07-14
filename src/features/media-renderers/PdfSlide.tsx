import type { SlideProps } from './types'
import { useMediaUrl } from '@/lib/hooks/useMediaUrl'
import { SlideLoading } from './SlideShell'

/**
 * PDFs render in the browser's native viewer via an iframe — zero dependencies,
 * works for both remote URLs and uploaded blobs (object URLs). The hash params
 * hide the viewer chrome and fit the page to width.
 */
export function PdfSlide({ item }: SlideProps) {
  const url = useMediaUrl(item.source)
  if (!url) return <SlideLoading />
  return (
    <iframe
      src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
      title={item.title}
      className="h-full w-full border-0 bg-white"
    />
  )
}

import type { SlideProps } from './types'
import { useMediaUrl } from '@/lib/hooks/useMediaUrl'
import { fitClass, SlideLoading } from './SlideShell'
import { cn } from '@/lib/cn'

export function ImageSlide({ item }: SlideProps) {
  const url = useMediaUrl(item.source)
  if (!url) return <SlideLoading />
  return (
    <img
      src={url}
      alt={item.title}
      draggable={false}
      loading="lazy"
      decoding="async"
      className={cn('h-full w-full', fitClass(item.fit))}
    />
  )
}

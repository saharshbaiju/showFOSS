import type { LucideIcon } from 'lucide-react'
import { FileText, Globe, Image as ImageIcon, Megaphone, MonitorPlay, Video } from 'lucide-react'
import type { MediaItem, MediaType } from '@/types'
import { cn } from '@/lib/cn'

export const MEDIA_ICON: Record<MediaType, LucideIcon> = {
  website: Globe,
  image: ImageIcon,
  video: Video,
  youtube: MonitorPlay,
  pdf: FileText,
  markdown: Megaphone,
}

/** The best still image we can show for an item without loading it. */
function thumbSrc(item: MediaItem): string | undefined {
  if (item.thumbnail) return item.thumbnail
  if (item.type === 'image' && item.source.kind === 'url') return item.source.url
  return undefined
}

export function ItemThumb({ item, className }: { item: MediaItem; className?: string }) {
  const Icon = MEDIA_ICON[item.type]
  const src = thumbSrc(item)

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg bg-canvas ring-1 ring-line',
        className,
      )}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
      ) : item.type === 'markdown' && item.source.kind === 'inline' ? (
        <p className="line-clamp-3 px-2 text-[10px] leading-tight text-muted">
          {item.source.text || 'Announcement'}
        </p>
      ) : (
        <Icon className="size-5 text-faint" />
      )}
    </div>
  )
}

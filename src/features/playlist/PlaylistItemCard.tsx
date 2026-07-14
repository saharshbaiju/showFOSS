import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { MediaItem } from '@/types'
import { MEDIA_TYPE_LABELS } from '@/types'
import { Badge, IconButton, Switch } from '@/components/ui'
import { cn } from '@/lib/cn'
import { ItemThumb } from './mediaMeta'

interface PlaylistItemCardProps {
  item: MediaItem
  index: number
  sortable: boolean
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function PlaylistItemCard({
  item,
  index,
  sortable,
  onEdit,
  onDuplicate,
  onDelete,
  onToggle,
}: PlaylistItemCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !sortable,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5 pr-3',
        'transition-shadow hover:shadow-soft',
        isDragging && 'z-10 shadow-pop',
        !item.enabled && 'opacity-55',
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className={cn(
          'shrink-0 touch-none text-faint transition-colors hover:text-muted',
          sortable ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-40',
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4.5" />
      </button>

      <span className="font-data w-5 shrink-0 text-center text-xs text-faint">{index + 1}</span>

      <ItemThumb item={item} className="aspect-video h-11 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{item.title}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <Badge tone="muted">{MEDIA_TYPE_LABELS[item.type]}</Badge>
          <Badge tone="neutral" mono>
            {item.duration}s
          </Badge>
          {item.type === 'website' && (item.refreshInterval ?? 0) > 0 && (
            <Badge tone="accent" mono>
              ↻ {item.refreshInterval}s
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <div className="mr-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <IconButton label="Edit" size="sm" onClick={() => onEdit(item.id)}>
            <Pencil />
          </IconButton>
          <IconButton label="Duplicate" size="sm" onClick={() => onDuplicate(item.id)}>
            <Copy />
          </IconButton>
          <IconButton label="Delete" size="sm" tone="danger" onClick={() => onDelete(item.id)}>
            <Trash2 />
          </IconButton>
        </div>
        <Switch
          checked={item.enabled}
          onChange={() => onToggle(item.id)}
          label={item.enabled ? 'Disable slide' : 'Enable slide'}
        />
      </div>
    </div>
  )
}

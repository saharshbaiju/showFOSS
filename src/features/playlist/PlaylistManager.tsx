import { useMemo, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useShallow } from 'zustand/react/shallow'
import { ListMusic, Plus, Search, Shuffle, X } from 'lucide-react'
import { selectOrderedItems, usePlaylistStore } from '@/store/usePlaylistStore'
import { Badge, Button, EmptyState, IconButton, Input, toast } from '@/components/ui'
import { PlaylistItemCard } from './PlaylistItemCard'
import { AddMediaDialog } from './AddMediaDialog'
import { ItemEditorDrawer } from './ItemEditorDrawer'

export function PlaylistManager() {
  const items = usePlaylistStore(useShallow(selectOrderedItems))
  const moveItem = usePlaylistStore((s) => s.moveItem)
  const duplicateItem = usePlaylistStore((s) => s.duplicateItem)
  const removeItem = usePlaylistStore((s) => s.removeItem)
  const toggleEnabled = usePlaylistStore((s) => s.toggleEnabled)
  const shuffleOrder = usePlaylistStore((s) => s.shuffleOrder)

  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((i) => i.title.toLowerCase().includes(q)) : items
  }, [items, query])

  const sortable = query.trim() === ''
  const enabledCount = items.filter((i) => i.enabled).length
  const editingItem = editingId ? items.find((i) => i.id === editingId) ?? null : null

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) moveItem(String(active.id), String(over.id))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-1 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-ink">Playlist</h2>
          <Badge mono>
            {enabledCount}/{items.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <IconButton
            label="Shuffle order"
            size="sm"
            onClick={() => {
              if (items.length > 1) {
                shuffleOrder()
                toast.success('Playlist shuffled')
              }
            }}
          >
            <Shuffle />
          </IconButton>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add media
          </Button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="relative px-1 pb-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search slides…"
            className="pl-9.5 pr-9"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-faint hover:text-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-1 pb-2">
        {items.length === 0 ? (
          <EmptyState
            icon={<ListMusic />}
            title="Your playlist is empty"
            description="Add websites, live leaderboards, posters, videos, or announcements to build your show."
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="size-4" />
                Add your first slide
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <p className="px-2 py-10 text-center text-sm text-muted">No slides match “{query}”.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={filtered.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {filtered.map((item) => (
                  <PlaylistItemCard
                    key={item.id}
                    item={item}
                    index={items.indexOf(item)}
                    sortable={sortable}
                    onEdit={setEditingId}
                    onDuplicate={duplicateItem}
                    onDelete={removeItem}
                    onToggle={toggleEnabled}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AddMediaDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <ItemEditorDrawer item={editingItem} onClose={() => setEditingId(null)} />
    </div>
  )
}

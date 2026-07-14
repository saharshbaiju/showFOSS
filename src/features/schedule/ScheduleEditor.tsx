import { Trash2, CalendarPlus, ListMusic } from 'lucide-react'
import {
  Button,
  EmptyState,
  IconButton,
  Input,
  Select,
  Switch,
} from '@/components/ui'
import { useShallow } from 'zustand/react/shallow'
import { useScheduleStore } from '@/store/useScheduleStore'
import { usePlaylistStore, selectOrderedItems } from '@/store/usePlaylistStore'
import { sortScheduleEntries } from '@/lib/time/schedule'

export function ScheduleEditor() {
  const enabled = useScheduleStore((s) => s.enabled)
  const setEnabled = useScheduleStore((s) => s.setEnabled)
  const entries = useScheduleStore((s) => s.entries)
  const addEntry = useScheduleStore((s) => s.addEntry)
  const updateEntry = useScheduleStore((s) => s.updateEntry)
  const removeEntry = useScheduleStore((s) => s.removeEntry)

  const items = usePlaylistStore(useShallow(selectOrderedItems))

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ListMusic />}
        title="Nothing to schedule yet"
        description="Add media to your playlist first, then pin items to specific times of day."
      />
    )
  }

  const sorted = sortScheduleEntries(entries)
  const itemOptions = items.map((item) => ({ value: item.id, label: `${item.title}` }))

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3.5">
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-ink">Follow schedule</div>
          <p className="mt-0.5 text-[13px] text-muted">
            When on, the show jumps to each item at its start time and pauses normal auto-advance.
          </p>
        </div>
        <Switch checked={enabled} onChange={setEnabled} label="Follow schedule" />
      </div>

      <div className="space-y-2">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line-strong px-4 py-8 text-center text-sm text-muted">
            No time slots yet. Add one below to pin an item to a specific time of day.
          </div>
        ) : (
          sorted.map((entry) => {
            const known = entry.itemId !== '' && items.some((item) => item.id === entry.itemId)
            const options = known
              ? itemOptions
              : [{ value: '', label: 'Choose an item…' }, ...itemOptions]
            return (
              <div
                key={entry.id}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5"
              >
                <Input
                  type="time"
                  value={entry.time}
                  onChange={(e) => updateEntry(entry.id, { time: e.target.value })}
                  className="font-data w-32 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Select
                    options={options}
                    value={entry.itemId}
                    onChange={(e) => updateEntry(entry.id, { itemId: e.target.value })}
                  />
                </div>
                <IconButton
                  label="Remove time slot"
                  tone="danger"
                  onClick={() => removeEntry(entry.id)}
                >
                  <Trash2 />
                </IconButton>
              </div>
            )
          })
        )}
      </div>

      <Button
        variant="secondary"
        onClick={() => addEntry({ time: '12:00', itemId: items[0]?.id ?? '' })}
      >
        <CalendarPlus className="size-4" />
        Add time slot
      </Button>
    </div>
  )
}

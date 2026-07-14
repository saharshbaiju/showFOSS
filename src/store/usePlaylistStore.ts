import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MediaItem } from '@/types'
import { safeStorage } from '@/lib/storage/safeStorage'
import { deleteBlob } from '@/lib/storage/mediaStore'
import { uid } from '@/lib/id'

interface PlaylistState {
  items: Record<string, MediaItem>
  order: string[]

  addItem: (item: MediaItem) => void
  /** Bulk load (import). `replace` clears existing items first. */
  loadItems: (items: MediaItem[], order: string[], replace?: boolean) => void
  updateItem: (id: string, patch: Partial<MediaItem>) => void
  removeItem: (id: string) => void
  duplicateItem: (id: string) => void
  toggleEnabled: (id: string) => void
  moveItem: (activeId: string, overId: string) => void
  setOrder: (order: string[]) => void
  shuffleOrder: () => void
  clear: () => void
}

/** Delete an item's IndexedDB blob only if no remaining item references it. */
function reapBlob(removed: MediaItem | undefined, remaining: Record<string, MediaItem>): void {
  if (removed?.source.kind !== 'idb') return
  const ref = removed.source.ref
  const stillUsed = Object.values(remaining).some(
    (i) => i.source.kind === 'idb' && i.source.ref === ref,
  )
  if (!stillUsed) void deleteBlob(ref)
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      items: {},
      order: [],

      addItem: (item) =>
        set((s) => ({
          items: { ...s.items, [item.id]: item },
          order: [...s.order, item.id],
        })),

      loadItems: (items, order, replace = true) =>
        set((s) => {
          const base = replace ? {} : { ...s.items }
          for (const it of items) base[it.id] = it
          const baseOrder = replace ? [] : [...s.order]
          const merged = [...baseOrder]
          for (const id of order) if (!merged.includes(id)) merged.push(id)
          return { items: base, order: merged.filter((id) => base[id]) }
        }),

      updateItem: (id, patch) =>
        set((s) => {
          const existing = s.items[id]
          if (!existing) return s
          return { items: { ...s.items, [id]: { ...existing, ...patch } } }
        }),

      removeItem: (id) =>
        set((s) => {
          const removed = s.items[id]
          const items = { ...s.items }
          delete items[id]
          reapBlob(removed, items)
          return { items, order: s.order.filter((x) => x !== id) }
        }),

      duplicateItem: (id) =>
        set((s) => {
          const original = s.items[id]
          if (!original) return s
          const copy: MediaItem = {
            ...original,
            id: uid('m'),
            title: `${original.title} copy`,
            createdAt: Date.now(),
          }
          const index = s.order.indexOf(id)
          const order = [...s.order]
          order.splice(index + 1, 0, copy.id)
          return { items: { ...s.items, [copy.id]: copy }, order }
        }),

      toggleEnabled: (id) =>
        set((s) => {
          const existing = s.items[id]
          if (!existing) return s
          return { items: { ...s.items, [id]: { ...existing, enabled: !existing.enabled } } }
        }),

      moveItem: (activeId, overId) =>
        set((s) => {
          const from = s.order.indexOf(activeId)
          const to = s.order.indexOf(overId)
          if (from === -1 || to === -1 || from === to) return s
          const order = [...s.order]
          order.splice(to, 0, order.splice(from, 1)[0])
          return { order }
        }),

      setOrder: (order) => set({ order }),

      shuffleOrder: () =>
        set((s) => {
          const order = [...s.order]
          for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[order[i], order[j]] = [order[j], order[i]]
          }
          return { order }
        }),

      clear: () => {
        const { items } = get()
        for (const item of Object.values(items)) {
          if (item.source.kind === 'idb') void deleteBlob(item.source.ref)
        }
        set({ items: {}, order: [] })
      },
    }),
    {
      name: 'showfoss:playlist',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ items: s.items, order: s.order }),
    },
  ),
)

/** Selector: items in playback order (enabled + disabled). */
export function selectOrderedItems(state: PlaylistState): MediaItem[] {
  return state.order.map((id) => state.items[id]).filter(Boolean)
}

/** Selector: only enabled items, in order — the actual presentation sequence. */
export function selectEnabledItems(state: PlaylistState): MediaItem[] {
  return selectOrderedItems(state).filter((i) => i.enabled)
}

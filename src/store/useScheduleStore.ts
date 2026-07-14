import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ScheduleEntry } from '@/types'
import { safeStorage } from '@/lib/storage/safeStorage'
import { uid } from '@/lib/id'

interface ScheduleState {
  enabled: boolean
  entries: ScheduleEntry[]

  setEnabled: (enabled: boolean) => void
  addEntry: (entry: Omit<ScheduleEntry, 'id'>) => void
  updateEntry: (id: string, patch: Partial<ScheduleEntry>) => void
  removeEntry: (id: string) => void
  loadSchedule: (enabled: boolean, entries: ScheduleEntry[]) => void
  clear: () => void
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      enabled: false,
      entries: [],

      setEnabled: (enabled) => set({ enabled }),

      addEntry: (entry) =>
        set((s) => ({ entries: [...s.entries, { ...entry, id: uid('s') }] })),

      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      loadSchedule: (enabled, entries) => set({ enabled, entries }),

      clear: () => set({ enabled: false, entries: [] }),
    }),
    {
      name: 'showfoss:schedule',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

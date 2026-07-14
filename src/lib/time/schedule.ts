import type { ScheduleEntry } from '@/types'

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function nowToMinutes(now: Date): number {
  return now.getHours() * 60 + now.getMinutes()
}

/**
 * The schedule entry whose window currently covers `now`. Each entry owns the
 * screen from its start time until the next entry's start time (entries sorted
 * by time). Before the first entry of the day, nothing is active and normal
 * auto-advance runs.
 */
export function resolveActiveScheduleEntry(
  now: Date,
  entries: ScheduleEntry[],
): ScheduleEntry | null {
  if (entries.length === 0) return null
  const sorted = [...entries].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
  const nowMin = nowToMinutes(now)
  let active: ScheduleEntry | null = null
  for (const entry of sorted) {
    if (timeToMinutes(entry.time) <= nowMin) active = entry
    else break
  }
  return active
}

export function sortScheduleEntries(entries: ScheduleEntry[]): ScheduleEntry[] {
  return [...entries].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
}

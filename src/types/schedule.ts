export interface ScheduleEntry {
  id: string
  /** 24h "HH:MM" — the moment this item takes over the screen. */
  time: string
  itemId: string
  label?: string
}

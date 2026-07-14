import { useEffect, useState } from 'react'

/** A `Date` that re-renders on an interval. Used by clock/countdown/schedule. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

export function formatClock(date: Date, format: '12h' | '24h', showSeconds = true): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: format === '12h',
  })
}

export function formatCountdown(msLeft: number): string {
  const clamped = Math.max(0, msLeft)
  const totalSeconds = Math.floor(clamped / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

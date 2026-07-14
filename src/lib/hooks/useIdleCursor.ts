import { useEffect, useState } from 'react'

/**
 * Returns true once the pointer has been idle for `timeout` ms, so the
 * presentation surface can hide its cursor and controls. Any input resets it.
 */
export function useIdleCursor(enabled: boolean, timeout = 3000): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIdle(false)
      return
    }
    let timer = 0
    const reset = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), timeout)
    }
    reset()
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel']
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((ev) => window.removeEventListener(ev, reset))
    }
  }, [enabled, timeout])

  return idle
}

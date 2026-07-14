import { useEffect, useRef } from 'react'

export interface ShortcutHandlers {
  onExit?: () => void
  onTogglePlay?: () => void
  onPrev?: () => void
  onNext?: () => void
  onFullscreen?: () => void
}

/**
 * Presentation keyboard map: Esc exit, Space pause/play, ←/→ prev/next, F
 * fullscreen. Handlers are held in a ref so the listener binds once and never
 * goes stale.
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled = true): void {
  const ref = useRef(handlers)
  ref.current = handlers

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
        return
      }
      const h = ref.current
      switch (e.key) {
        case 'Escape':
          h.onExit?.()
          break
        case ' ':
        case 'Spacebar':
          e.preventDefault()
          h.onTogglePlay?.()
          break
        case 'ArrowLeft':
          h.onPrev?.()
          break
        case 'ArrowRight':
          h.onNext?.()
          break
        case 'f':
        case 'F':
          h.onFullscreen?.()
          break
        default:
          return
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}

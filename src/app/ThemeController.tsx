import { useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'

/**
 * Bridges the settings store to CSS: sets `data-theme` (light/dark) and the
 * runtime `--accent` custom property on <html>, so the whole app — including
 * Tailwind's bg-accent/text-accent utilities — follows the user's choice.
 */
export function ThemeController() {
  const mode = useSettingsStore((s) => s.theme.mode)
  const accent = useSettingsStore((s) => s.theme.accent)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = mode
    root.style.setProperty('--accent', accent)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0a0a0c' : '#ffffff')
  }, [mode, accent])

  return null
}

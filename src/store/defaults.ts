import type { AppSettings, WidgetSettings } from '@/types'
import { DEFAULT_DURATION } from '@/types'

export const DEFAULT_ACCENT = '#6d4aff'
export const DEFAULT_PRESENTATION_BG = '#0a0a0c'

export const ACCENT_PRESETS = [
  '#6d4aff', // electric violet (default)
  '#2563eb', // blue
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#0b0b0f', // ink
]

export const defaultWidgets: WidgetSettings = {
  clock: { enabled: false, position: 'top-right', clockFormat: '24h', showSeconds: true },
  countdown: {
    enabled: false,
    position: 'top-center',
    countdownTarget: '',
    text: 'Starts in',
  },
  eventTitle: { enabled: false, position: 'top-left', text: 'My Event' },
  logo: { enabled: false, position: 'top-left', imageUrl: '' },
  sponsor: { enabled: false, position: 'bottom-right', text: 'Sponsored by', imageUrl: '' },
  qr: { enabled: false, position: 'bottom-right', qrValue: '', qrCaption: 'Scan to visit' },
  ticker: { enabled: false, position: 'bottom-center', text: 'Welcome to the event!' },
}

export const defaultSettings: AppSettings = {
  theme: {
    mode: 'light',
    accent: DEFAULT_ACCENT,
    presentationBg: DEFAULT_PRESENTATION_BG,
  },
  playback: {
    transition: 'fade',
    transitionDuration: 0.6,
    duration: DEFAULT_DURATION,
    loop: true,
    autoPlay: true,
    shuffleOnLoop: false,
    showProgress: true,
    showControls: true,
  },
  widgets: defaultWidgets,
}

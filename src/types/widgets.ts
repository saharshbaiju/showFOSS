export const WIDGET_TYPES = [
  'clock',
  'countdown',
  'eventTitle',
  'logo',
  'sponsor',
  'qr',
  'ticker',
] as const

export type WidgetType = (typeof WIDGET_TYPES)[number]

export const WIDGET_LABELS: Record<WidgetType, string> = {
  clock: 'Live clock',
  countdown: 'Countdown',
  eventTitle: 'Event title',
  logo: 'Event logo',
  sponsor: 'Sponsor banner',
  qr: 'QR code',
  ticker: 'Footer ticker',
}

export const WIDGET_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

export type WidgetPosition = (typeof WIDGET_POSITIONS)[number]

export interface WidgetConfig {
  enabled: boolean
  position: WidgetPosition
  /** clock */
  clockFormat?: '12h' | '24h'
  showSeconds?: boolean
  /** countdown */
  countdownTarget?: string // ISO datetime
  /** shared text slot: event title, ticker copy, sponsor caption */
  text?: string
  /** logo / sponsor image URL */
  imageUrl?: string
  /** qr */
  qrValue?: string
  qrCaption?: string
}

export type WidgetSettings = Record<WidgetType, WidgetConfig>

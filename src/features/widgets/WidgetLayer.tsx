import type { ComponentType } from 'react'
import type { WidgetConfig, WidgetPosition, WidgetType } from '@/types'
import { WIDGET_POSITIONS, WIDGET_TYPES } from '@/types'
import { useSettingsStore } from '@/store/useSettingsStore'
import { cn } from '@/lib/cn'
import {
  ClockWidget,
  CountdownWidget,
  EventTitleWidget,
  FooterTicker,
  LogoWidget,
  QrWidget,
  SponsorBanner,
} from './widgets'

/** Non-ticker widgets, keyed by type. Ticker is handled separately (full width). */
type AnchoredWidget = Exclude<WidgetType, 'ticker'>

const WIDGET_COMPONENTS: Record<
  AnchoredWidget,
  ComponentType<{ config: WidgetConfig; compact?: boolean }>
> = {
  clock: ClockWidget,
  countdown: CountdownWidget,
  eventTitle: EventTitleWidget,
  logo: LogoWidget,
  sponsor: SponsorBanner,
  qr: QrWidget,
}

/** Maps a position to its absolute anchor + flex-column alignment. */
const POSITION_CLASSES: Record<WidgetPosition, string> = {
  'top-left': 'top-0 left-0 items-start justify-start text-left',
  'top-center': 'top-0 inset-x-0 items-center justify-start text-center',
  'top-right': 'top-0 right-0 items-end justify-start text-right',
  'bottom-left': 'bottom-0 left-0 items-start justify-end text-left',
  'bottom-center': 'bottom-0 inset-x-0 items-center justify-end text-center',
  'bottom-right': 'bottom-0 right-0 items-end justify-end text-right',
}

/**
 * Overlay host for widgets. Fills its (relative) parent, sits above the stage,
 * and never intercepts pointer events. Widgets that share an anchor stack in a
 * gapped column; the ticker always spans the full width at the very bottom.
 */
export function WidgetLayer({ compact = false }: { compact?: boolean }) {
  const widgets = useSettingsStore((s) => s.widgets)

  const anchors = WIDGET_POSITIONS.map((position) => ({
    position,
    types: WIDGET_TYPES.filter(
      (type): type is AnchoredWidget =>
        type !== 'ticker' && widgets[type].enabled && widgets[type].position === position,
    ),
  })).filter((anchor) => anchor.types.length > 0)

  const pad = compact ? 'p-3' : 'p-6 md:p-8'
  const gap = compact ? 'gap-2' : 'gap-3'
  const ticker = widgets.ticker

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {anchors.map(({ position, types }) => (
        <div
          key={position}
          className={cn('absolute flex flex-col', pad, gap, POSITION_CLASSES[position])}
        >
          {types.map((type) => {
            const Component = WIDGET_COMPONENTS[type]
            return <Component key={type} config={widgets[type]} compact={compact} />
          })}
        </div>
      ))}

      {ticker.enabled ? <FooterTicker config={ticker} compact={compact} /> : null}
    </div>
  )
}

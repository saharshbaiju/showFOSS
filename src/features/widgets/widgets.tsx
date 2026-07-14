import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import type { WidgetConfig } from '@/types'
import { useNow, formatClock, formatCountdown } from '@/lib/time/clock'
import { cn } from '@/lib/cn'

interface WidgetProps {
  config: WidgetConfig
  compact?: boolean
}

/**
 * Glassy pill used by most widgets. Legible over the dark presentation stage:
 * translucent black, blur, hairline ring and near-white text.
 */
function Pill({
  children,
  compact,
  className,
}: {
  children: ReactNode
  compact?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'inline-flex items-center rounded-xl bg-black/45 text-white ring-1 ring-white/10 backdrop-blur-md',
        compact ? 'px-2.5 py-1.5' : 'px-5 py-3',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export function ClockWidget({ config, compact }: WidgetProps) {
  const now = useNow()
  const time = formatClock(now, config.clockFormat ?? '24h', config.showSeconds ?? true)
  return (
    <Pill compact={compact}>
      <span
        className={cn(
          'font-data font-semibold tabular-nums tracking-tight',
          compact ? 'text-lg' : 'text-4xl md:text-5xl',
        )}
      >
        {time}
      </span>
    </Pill>
  )
}

export function CountdownWidget({ config, compact }: WidgetProps) {
  const now = useNow()
  const target = config.countdownTarget ? new Date(config.countdownTarget).getTime() : Number.NaN
  if (Number.isNaN(target)) return null

  const msLeft = target - now.getTime()
  const live = msLeft <= 0

  return (
    <Pill compact={compact} className="flex-col items-start gap-1">
      {config.text ? (
        <span
          className={cn(
            'font-medium uppercase tracking-[0.18em] text-white/70',
            compact ? 'text-[10px]' : 'text-xs md:text-sm',
          )}
        >
          {config.text}
        </span>
      ) : null}
      {live ? (
        <span
          className={cn(
            'font-data font-bold uppercase tracking-widest text-live',
            compact ? 'text-lg' : 'text-4xl md:text-5xl',
          )}
        >
          Live now
        </span>
      ) : (
        <span
          className={cn(
            'font-data font-semibold tabular-nums tracking-tight',
            compact ? 'text-lg' : 'text-4xl md:text-5xl',
          )}
        >
          {formatCountdown(msLeft)}
        </span>
      )}
    </Pill>
  )
}

export function EventTitleWidget({ config, compact }: WidgetProps) {
  if (!config.text) return null
  return (
    <Pill compact={compact}>
      <span
        className={cn(
          'font-semibold tracking-tight',
          compact ? 'text-sm' : 'text-2xl md:text-3xl',
        )}
      >
        {config.text}
      </span>
    </Pill>
  )
}

export function LogoWidget({ config, compact }: WidgetProps) {
  if (!config.imageUrl) return null
  return (
    <Pill compact={compact} className={compact ? 'p-1.5' : 'p-3'}>
      <img
        src={config.imageUrl}
        alt=""
        className={cn('w-auto object-contain', compact ? 'max-h-8' : 'max-h-16 md:max-h-24')}
      />
    </Pill>
  )
}

export function SponsorBanner({ config, compact }: WidgetProps) {
  if (!config.text && !config.imageUrl) return null
  return (
    <Pill compact={compact} className="flex-col items-center gap-1.5">
      <span
        className={cn(
          'font-medium uppercase tracking-[0.18em] text-white/60',
          compact ? 'text-[9px]' : 'text-[10px] md:text-xs',
        )}
      >
        Sponsored by
      </span>
      {config.imageUrl ? (
        <img
          src={config.imageUrl}
          alt=""
          className={cn('w-auto object-contain', compact ? 'max-h-6' : 'max-h-10 md:max-h-14')}
        />
      ) : null}
      {config.text ? (
        <span className={cn('font-semibold', compact ? 'text-xs' : 'text-base md:text-lg')}>
          {config.text}
        </span>
      ) : null}
    </Pill>
  )
}

export function QrWidget({ config, compact }: WidgetProps) {
  if (!config.qrValue) return null
  const size = compact ? 56 : 128
  return (
    <Pill compact={compact} className="flex-col items-center gap-2">
      <div className={cn('rounded-lg bg-white', compact ? 'p-1.5' : 'p-2.5')}>
        <QRCodeSVG value={config.qrValue} size={size} bgColor="#ffffff" fgColor="#000000" />
      </div>
      {config.qrCaption ? (
        <span
          className={cn(
            'text-center font-medium text-white/85',
            compact ? 'text-[10px]' : 'text-sm md:text-base',
          )}
        >
          {config.qrCaption}
        </span>
      ) : null}
    </Pill>
  )
}

/**
 * Full-width scrolling marquee pinned to the very bottom of the stage.
 * The text is duplicated so the `-50%` keyframe loops seamlessly.
 */
export function FooterTicker({ config, compact }: WidgetProps) {
  if (!config.text) return null
  const item = cn('px-8 font-medium', compact ? 'text-xs' : 'text-lg md:text-2xl')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 bottom-0 overflow-hidden bg-black/55 text-white ring-1 ring-white/10 backdrop-blur-md"
    >
      <div
        className={cn(
          'flex w-max whitespace-nowrap [animation:ticker-scroll_30s_linear_infinite]',
          compact ? 'py-1' : 'py-2 md:py-3',
        )}
      >
        <span className={item}>{config.text}</span>
        <span className={item} aria-hidden>
          {config.text}
        </span>
      </div>
    </motion.div>
  )
}

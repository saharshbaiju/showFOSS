import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import {
  Sun,
  Moon,
  Palette,
  Play,
  LayoutGrid,
  Database,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
} from 'lucide-react'
import {
  Badge,
  Button,
  Eyebrow,
  Field,
  Input,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  ColorField,
} from '@/components/ui'
import { toast } from '@/components/ui'
import type {
  ThemeMode,
  TransitionName,
  WidgetPosition,
  WidgetType,
} from '@/types'
import {
  TRANSITIONS,
  TRANSITION_LABELS,
  WIDGET_TYPES,
  WIDGET_LABELS,
  WIDGET_POSITIONS,
} from '@/types'
import { useSettingsStore, selectAppSettings } from '@/store/useSettingsStore'
import { usePlaylistStore, selectOrderedItems } from '@/store/usePlaylistStore'
import { useScheduleStore } from '@/store/useScheduleStore'
import { ACCENT_PRESETS } from '@/store/defaults'
import {
  buildBundle,
  downloadBundle,
  parseBundle,
  readFileAsText,
} from '@/lib/export/playlistIo'
import { estimateUsage, requestPersistence } from '@/lib/storage/mediaStore'

type Section = 'appearance' | 'playback' | 'widgets' | 'data'

const SECTION_OPTIONS = [
  { value: 'appearance' as const, label: iconLabel(<Palette />, 'Appearance') },
  { value: 'playback' as const, label: iconLabel(<Play />, 'Playback') },
  { value: 'widgets' as const, label: iconLabel(<LayoutGrid />, 'Widgets') },
  { value: 'data' as const, label: iconLabel(<Database />, 'Data') },
]

const POSITION_LABELS: Record<WidgetPosition, string> = {
  'top-left': 'Top left',
  'top-center': 'Top center',
  'top-right': 'Top right',
  'bottom-left': 'Bottom left',
  'bottom-center': 'Bottom center',
  'bottom-right': 'Bottom right',
}

const POSITION_OPTIONS = WIDGET_POSITIONS.map((p) => ({
  value: p,
  label: POSITION_LABELS[p],
}))

const TRANSITION_OPTIONS = TRANSITIONS.map((t) => ({
  value: t,
  label: TRANSITION_LABELS[t],
}))

const PRESENTATION_BG_PRESETS = ['#0a0a0c', '#000000', '#111827', '#1a1a2e', '#ffffff']

function iconLabel(icon: ReactNode, text: string): ReactNode {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="[&_svg]:size-3.5">{icon}</span>
      {text}
    </span>
  )
}

export function SettingsPanel() {
  const [section, setSection] = useState<Section>('appearance')

  return (
    <div className="space-y-6">
      <SegmentedControl<Section>
        value={section}
        onChange={setSection}
        options={SECTION_OPTIONS}
        className="w-full [&>button]:flex-1"
      />

      {section === 'appearance' && <AppearanceSection />}
      {section === 'playback' && <PlaybackSection />}
      {section === 'widgets' && <WidgetsSection />}
      {section === 'data' && <DataSection />}
    </div>
  )
}

function AppearanceSection() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  return (
    <div className="space-y-5">
      <Field label="Theme" hint="Controls the dashboard chrome, not the show stage.">
        <SegmentedControl<ThemeMode>
          value={theme.mode}
          onChange={(mode) => setTheme({ mode })}
          options={[
            { value: 'light', label: iconLabel(<Sun />, 'Light'), title: 'Light' },
            { value: 'dark', label: iconLabel(<Moon />, 'Dark'), title: 'Dark' },
          ]}
        />
      </Field>

      <Field label="Accent color" hint="Drives buttons, links, and highlights across the app.">
        <ColorField
          value={theme.accent}
          onChange={(accent) => setTheme({ accent })}
          presets={ACCENT_PRESETS}
        />
      </Field>

      <Field label="Presentation background" hint="Shown behind slides during a show.">
        <ColorField
          value={theme.presentationBg}
          onChange={(presentationBg) => setTheme({ presentationBg })}
          presets={PRESENTATION_BG_PRESETS}
        />
      </Field>
    </div>
  )
}

function PlaybackSection() {
  const playback = useSettingsStore((s) => s.playback)
  const setPlayback = useSettingsStore((s) => s.setPlayback)

  return (
    <div className="space-y-5">
      <Field label="Default transition" hint="Applied to new slides that don't set their own.">
        <Select
          options={TRANSITION_OPTIONS}
          value={playback.transition}
          onChange={(e) => setPlayback({ transition: e.target.value as TransitionName })}
        />
      </Field>

      <Field
        label={
          <span className="flex items-center justify-between gap-3">
            <span>Default duration</span>
            <Badge mono>{playback.duration}s</Badge>
          </span>
        }
        hint="Seconds each new slide stays on screen."
      >
        <Slider
          value={playback.duration}
          min={3}
          max={120}
          step={1}
          onChange={(e) => setPlayback({ duration: Number(e.target.value) })}
        />
      </Field>

      <Field
        label={
          <span className="flex items-center justify-between gap-3">
            <span>Transition speed</span>
            <Badge mono>{playback.transitionDuration.toFixed(1)}s</Badge>
          </span>
        }
        hint="How long the animation between slides lasts."
      >
        <Slider
          value={playback.transitionDuration}
          min={0.2}
          max={1.6}
          step={0.1}
          onChange={(e) => setPlayback({ transitionDuration: Number(e.target.value) })}
        />
      </Field>

      <div className="divide-y divide-line rounded-xl border border-line bg-surface">
        <ToggleRow
          label="Loop playlist"
          description="Restart from the top once the last slide finishes."
          checked={playback.loop}
          onChange={(loop) => setPlayback({ loop })}
        />
        <ToggleRow
          label="Auto-play"
          description="Begin advancing slides automatically when a show starts."
          checked={playback.autoPlay}
          onChange={(autoPlay) => setPlayback({ autoPlay })}
        />
        <ToggleRow
          label="Shuffle on loop"
          description="Reshuffle the order each time the playlist loops."
          checked={playback.shuffleOnLoop}
          onChange={(shuffleOnLoop) => setPlayback({ shuffleOnLoop })}
        />
        <ToggleRow
          label="Show progress bar"
          description="Display a slim progress indicator during the show."
          checked={playback.showProgress}
          onChange={(showProgress) => setPlayback({ showProgress })}
        />
        <ToggleRow
          label="On-screen controls"
          description="Show the floating control bar when the cursor moves. Turn off for a hands-off display — keyboard shortcuts still work."
          checked={playback.showControls}
          onChange={(showControls) => setPlayback({ showControls })}
        />
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-ink">{label}</div>
        <p className="mt-0.5 text-[13px] text-muted">{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

function WidgetsSection() {
  return (
    <div className="space-y-3">
      {WIDGET_TYPES.map((type) => (
        <WidgetRow key={type} type={type} />
      ))}
    </div>
  )
}

function WidgetRow({ type }: { type: WidgetType }) {
  const cfg = useSettingsStore((s) => s.widgets[type])
  const setWidget = useSettingsStore((s) => s.setWidget)
  const toggleWidget = useSettingsStore((s) => s.toggleWidget)

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-[13px] font-medium text-ink">{WIDGET_LABELS[type]}</span>
        <Switch
          checked={cfg.enabled}
          onChange={() => toggleWidget(type)}
          label={WIDGET_LABELS[type]}
        />
      </div>

      {cfg.enabled && (
        <div className="space-y-4 border-t border-line px-4 py-4">
          <Field label="Position">
            <Select
              options={POSITION_OPTIONS}
              value={cfg.position}
              onChange={(e) => setWidget(type, { position: e.target.value as WidgetPosition })}
            />
          </Field>

          {type === 'clock' && (
            <>
              <Field label="Clock format">
                <SegmentedControl<'12h' | '24h'>
                  value={cfg.clockFormat ?? '24h'}
                  onChange={(clockFormat) => setWidget(type, { clockFormat })}
                  options={[
                    { value: '12h', label: '12-hour' },
                    { value: '24h', label: '24-hour' },
                  ]}
                />
              </Field>
              <ToggleRow
                label="Show seconds"
                description="Include seconds in the clock readout."
                checked={cfg.showSeconds ?? false}
                onChange={(showSeconds) => setWidget(type, { showSeconds })}
              />
            </>
          )}

          {type === 'countdown' && (
            <>
              <Field label="Counts down to" hint="Target date and time for the countdown.">
                <Input
                  type="datetime-local"
                  value={cfg.countdownTarget ?? ''}
                  onChange={(e) => setWidget(type, { countdownTarget: e.target.value })}
                />
              </Field>
              <Field label="Label">
                <Input
                  value={cfg.text ?? ''}
                  placeholder="Starts in"
                  onChange={(e) => setWidget(type, { text: e.target.value })}
                />
              </Field>
            </>
          )}

          {type === 'eventTitle' && (
            <Field label="Title text">
              <Input
                value={cfg.text ?? ''}
                placeholder="My Event"
                onChange={(e) => setWidget(type, { text: e.target.value })}
              />
            </Field>
          )}

          {type === 'logo' && (
            <Field label="Logo image URL">
              <Input
                type="url"
                value={cfg.imageUrl ?? ''}
                placeholder="https://…/logo.png"
                onChange={(e) => setWidget(type, { imageUrl: e.target.value })}
              />
            </Field>
          )}

          {type === 'sponsor' && (
            <>
              <Field label="Caption">
                <Input
                  value={cfg.text ?? ''}
                  placeholder="Sponsored by"
                  onChange={(e) => setWidget(type, { text: e.target.value })}
                />
              </Field>
              <Field label="Sponsor image URL">
                <Input
                  type="url"
                  value={cfg.imageUrl ?? ''}
                  placeholder="https://…/sponsor.png"
                  onChange={(e) => setWidget(type, { imageUrl: e.target.value })}
                />
              </Field>
            </>
          )}

          {type === 'qr' && (
            <>
              <Field label="QR link or text">
                <Input
                  value={cfg.qrValue ?? ''}
                  placeholder="https://…"
                  onChange={(e) => setWidget(type, { qrValue: e.target.value })}
                />
              </Field>
              <Field label="Caption">
                <Input
                  value={cfg.qrCaption ?? ''}
                  placeholder="Scan to visit"
                  onChange={(e) => setWidget(type, { qrCaption: e.target.value })}
                />
              </Field>
            </>
          )}

          {type === 'ticker' && (
            <Field label="Ticker text">
              <Input
                value={cfg.text ?? ''}
                placeholder="Welcome to the event!"
                onChange={(e) => setWidget(type, { text: e.target.value })}
              />
            </Field>
          )}
        </div>
      )}
    </div>
  )
}

function DataSection() {
  const reset = useSettingsStore((s) => s.reset)
  const fileRef = useRef<HTMLInputElement>(null)
  const [usage, setUsage] = useState<{ usage: number; quota: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    estimateUsage().then((u) => {
      if (!cancelled) setUsage(u)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function handleExport() {
    const pl = usePlaylistStore.getState()
    const settings = selectAppSettings(useSettingsStore.getState())
    const sch = useScheduleStore.getState()
    downloadBundle(
      buildBundle({
        items: selectOrderedItems(pl),
        order: pl.order,
        settings,
        schedule: { enabled: sch.enabled, entries: sch.entries },
      }),
    )
    toast.success('Playlist exported')
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await readFileAsText(file)
      const parsed = parseBundle(text)
      usePlaylistStore.getState().loadItems(parsed.items, parsed.order, true)
      if (parsed.settings) useSettingsStore.getState().loadSettings(parsed.settings)
      if (parsed.schedule) {
        useScheduleStore.getState().loadSchedule(parsed.schedule.enabled, parsed.schedule.entries)
      }
      toast.success('Playlist imported')
      if (parsed.unresolvedCount > 0) {
        const n = parsed.unresolvedCount
        toast.show(
          `${n} uploaded file${n === 1 ? '' : 's'} couldn't be restored — they live only in the original browser.`,
        )
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed')
    }
  }

  async function handlePersist() {
    const ok = await requestPersistence()
    if (ok) toast.success('Storage is now persistent')
    else toast.show("The browser didn't grant persistent storage")
  }

  function handleReset() {
    reset()
    toast.success('Settings reset to defaults')
  }

  function handleClearEverything() {
    const ok = window.confirm(
      'Clear everything? This removes all media, the schedule, and settings. This cannot be undone.',
    )
    if (!ok) return
    usePlaylistStore.getState().clear()
    useScheduleStore.getState().clear()
    reset()
    setUsage(null)
    toast.success('Everything cleared')
  }

  const usedMb = usage ? (usage.usage / 1024 / 1024).toFixed(1) : '0.0'
  const quotaMb = usage ? (usage.quota / 1024 / 1024).toFixed(0) : '0'
  const pct = usage && usage.quota > 0 ? Math.min(100, (usage.usage / usage.quota) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Eyebrow>Backup</Eyebrow>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="primary" onClick={handleExport}>
            <Download className="size-4" />
            Export playlist
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
            Import playlist
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
        <p className="text-[13px] text-muted">
          Exports the full playlist, settings, and schedule as a JSON file. Uploaded media stays in
          this browser and can't travel in the file.
        </p>
      </div>

      <div className="space-y-3">
        <Eyebrow>Storage</Eyebrow>
        <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted">Used</span>
            <span className="font-data text-ink">
              {usedMb} MB <span className="text-faint">/ {quotaMb} MB</span>
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handlePersist}>
          <ShieldCheck className="size-4" />
          Make storage persistent
        </Button>
      </div>

      <div className="space-y-3">
        <Eyebrow>Danger zone</Eyebrow>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset settings
          </Button>
          <Button variant="danger" onClick={handleClearEverything}>
            <Trash2 className="size-4" />
            Clear everything
          </Button>
        </div>
      </div>
    </div>
  )
}

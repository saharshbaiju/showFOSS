import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { MediaItem, ObjectFit, TransitionName } from '@/types'
import { MEDIA_TYPE_LABELS, TRANSITIONS, TRANSITION_LABELS } from '@/types'
import { usePlaylistStore } from '@/store/usePlaylistStore'
import { Badge, Button, Drawer, Field, Input, Select, Slider, Switch, Textarea, toast } from '@/components/ui'
import { normalizeUrl } from '@/lib/media/detectType'
import { ItemThumb } from './mediaMeta'

interface FormValues {
  title: string
  url: string
  text: string
  duration: number
  transition: string
  fit: ObjectFit
  enabled: boolean
  refreshInterval: number
  advanceOnEnd: boolean
  muted: boolean
}

const TRANSITION_OPTIONS = [
  { value: '', label: 'Default' },
  ...TRANSITIONS.map((t) => ({ value: t, label: TRANSITION_LABELS[t] })),
]

const FIT_OPTIONS = [
  { value: 'contain', label: 'Fit (contain)' },
  { value: 'cover', label: 'Fill (cover)' },
  { value: 'fill', label: 'Stretch' },
]

const REFRESH_OPTIONS = [
  { value: '0', label: 'Never' },
  { value: '15', label: 'Every 15s' },
  { value: '30', label: 'Every 30s' },
  { value: '60', label: 'Every 1 min' },
  { value: '120', label: 'Every 2 min' },
  { value: '300', label: 'Every 5 min' },
]

export function ItemEditorDrawer({ item, onClose }: { item: MediaItem | null; onClose: () => void }) {
  const updateItem = usePlaylistStore((s) => s.updateItem)
  const { register, handleSubmit, control, reset, watch } = useForm<FormValues>({
    defaultValues: {
      title: '',
      url: '',
      text: '',
      duration: 12,
      transition: '',
      fit: 'contain',
      enabled: true,
      refreshInterval: 0,
      advanceOnEnd: false,
      muted: true,
    },
  })
  const duration = watch('duration')

  useEffect(() => {
    if (!item) return
    reset({
      title: item.title,
      url: item.source.kind === 'url' ? item.source.url : '',
      text: item.source.kind === 'inline' ? item.source.text : '',
      duration: item.duration,
      transition: item.transition ?? '',
      fit: item.fit ?? 'contain',
      enabled: item.enabled,
      refreshInterval: item.refreshInterval ?? 0,
      advanceOnEnd: item.advanceOnEnd ?? false,
      muted: item.muted ?? true,
    })
  }, [item, reset])

  const onSubmit = handleSubmit((values) => {
    if (!item) return
    const patch: Partial<MediaItem> = {
      title: values.title.trim() || 'Untitled',
      duration: Math.max(1, Number(values.duration)),
      transition: values.transition ? (values.transition as TransitionName) : undefined,
      fit: values.fit,
      enabled: values.enabled,
    }
    if (item.type === 'website') patch.refreshInterval = Number(values.refreshInterval)
    if (item.type === 'video' || item.type === 'youtube') {
      patch.advanceOnEnd = values.advanceOnEnd
      patch.muted = values.muted
    }
    if (item.source.kind === 'url' && values.url.trim()) {
      patch.source = { kind: 'url', url: normalizeUrl(values.url) }
    }
    if (item.source.kind === 'inline') {
      patch.source = { kind: 'inline', text: values.text }
    }
    updateItem(item.id, patch)
    toast.success('Slide updated')
    onClose()
  })

  const isTimeControl = item?.type === 'video' || item?.type === 'youtube'
  const supportsFit = item?.type === 'image' || item?.type === 'video'

  return (
    <Drawer
      open={!!item}
      onClose={onClose}
      title="Edit slide"
      description={item ? MEDIA_TYPE_LABELS[item.type] : undefined}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save changes</Button>
        </>
      }
    >
      {item && (
        <form
          onSubmit={onSubmit}
          className="space-y-5"
          key={item.id}
        >
          <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-3">
            <ItemThumb item={item} className="aspect-video h-12 shrink-0" />
            <div className="min-w-0">
              <Badge tone="muted">{MEDIA_TYPE_LABELS[item.type]}</Badge>
            </div>
            <div className="ml-auto">
              <Controller
                control={control}
                name="enabled"
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} label="Enabled" />
                )}
              />
            </div>
          </div>

          <Field label="Title">
            <Input {...register('title')} />
          </Field>

          {item.source.kind === 'url' && (
            <Field label="URL">
              <Input {...register('url')} spellCheck={false} />
            </Field>
          )}

          {item.source.kind === 'inline' && (
            <Field label="Message" hint="Markdown supported.">
              <Textarea {...register('text')} rows={6} />
            </Field>
          )}

          <Field
            label={
              <span className="flex items-center justify-between gap-3">
                <span>Duration</span>
                <Badge mono>{duration}s</Badge>
              </span>
            }
            hint={isTimeControl ? 'Ignored when “advance when finished” is on.' : undefined}
          >
            <Controller
              control={control}
              name="duration"
              render={({ field }) => (
                <Slider
                  value={field.value}
                  min={2}
                  max={300}
                  step={1}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Field>

          <Field label="Transition" hint="Overrides the default for this slide.">
            <Select options={TRANSITION_OPTIONS} {...register('transition')} />
          </Field>

          {supportsFit && (
            <Field label="Scaling">
              <Select options={FIT_OPTIONS} {...register('fit')} />
            </Field>
          )}

          {item.type === 'website' && (
            <Field label="Auto-refresh" hint="Reload the page to keep live boards current.">
              <Select options={REFRESH_OPTIONS} {...register('refreshInterval')} />
            </Field>
          )}

          {isTimeControl && (
            <div className="space-y-3 rounded-xl border border-line bg-canvas p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-ink">Advance when finished</p>
                  <p className="text-[12px] text-muted">Move on when the clip ends.</p>
                </div>
                <Controller
                  control={control}
                  name="advanceOnEnd"
                  render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-ink">Muted</p>
                  <p className="text-[12px] text-muted">Required for reliable autoplay.</p>
                </div>
                <Controller
                  control={control}
                  name="muted"
                  render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
                />
              </div>
            </div>
          )}
        </form>
      )}
    </Drawer>
  )
}

import { useRef, useState } from 'react'
import { FileUp, Link2, Loader2, Upload } from 'lucide-react'
import { MEDIA_TYPE_LABELS } from '@/types'
import { usePlaylistStore } from '@/store/usePlaylistStore'
import { Badge, Button, Field, Input, Modal, SegmentedControl, Textarea, toast } from '@/components/ui'
import { detectTypeFromUrl, looksLikeUrl, normalizeUrl } from '@/lib/media/detectType'
import { cn } from '@/lib/cn'
import { itemFromFile, itemFromText, itemFromUrl } from './createItem'

type Tab = 'link' | 'upload' | 'text'

const TABS = [
  { value: 'link' as const, label: 'Link', title: 'Add by URL' },
  { value: 'upload' as const, label: 'Upload', title: 'Upload files' },
  { value: 'text' as const, label: 'Announcement', title: 'Write an announcement' },
]

export function AddMediaDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addItem = usePlaylistStore((s) => s.addItem)
  const [tab, setTab] = useState<Tab>('link')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const detected = url.trim() ? MEDIA_TYPE_LABELS[detectTypeFromUrl(normalizeUrl(url))] : null

  const close = () => {
    setUrl('')
    setTitle('')
    setText('')
    setDragging(false)
    setTab('link')
    onClose()
  }

  const addLink = () => {
    if (!looksLikeUrl(url)) {
      toast.error('Enter a valid URL (e.g. example.com)')
      return
    }
    const item = itemFromUrl(url)
    addItem(item)
    toast.success(`Added ${MEDIA_TYPE_LABELS[item.type].toLowerCase()}`)
    close()
  }

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return
    setBusy(true)
    let added = 0
    let skipped = 0
    for (const file of list) {
      const item = await itemFromFile(file)
      if (item) {
        addItem(item)
        added++
      } else {
        skipped++
      }
    }
    setBusy(false)
    if (added) toast.success(`Added ${added} file${added > 1 ? 's' : ''}`)
    if (skipped) toast.error(`Skipped ${skipped} unsupported file${skipped > 1 ? 's' : ''}`)
    if (added) close()
  }

  const addAnnouncement = () => {
    if (!text.trim()) {
      toast.error('Write something first')
      return
    }
    addItem(itemFromText(title, text))
    toast.success('Announcement added')
    close()
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={close}>
        Cancel
      </Button>
      {tab === 'link' && <Button onClick={addLink}>Add to playlist</Button>}
      {tab === 'text' && <Button onClick={addAnnouncement}>Add to playlist</Button>}
      {tab === 'upload' && (
        <Button onClick={() => fileInput.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
          Choose files
        </Button>
      )}
    </>
  )

  return (
    <Modal open={open} onClose={close} title="Add media" size="md" footer={footer}>
      <SegmentedControl value={tab} onChange={setTab} options={TABS} className="mb-5 w-full" />

      {tab === 'link' && (
        <div className="space-y-3">
          <Field
            label="Address"
            hint="Websites & live leaderboards, images, MP4 videos, YouTube links, or PDFs."
          >
            <div className="flex items-center gap-2">
              <span className="text-faint">
                <Link2 className="size-4" />
              </span>
              <Input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                placeholder="example.com/leaderboard"
              />
            </div>
          </Field>
          {detected && (
            <p className="text-[13px] text-muted">
              Detected as <Badge tone="accent">{detected}</Badge>
            </p>
          )}
        </div>
      )}

      {tab === 'upload' && (
        <div>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf,.md,.markdown,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              if (e.dataTransfer.files) void addFiles(e.dataTransfer.files)
            }}
            className={cn(
              'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
              dragging ? 'border-accent bg-accent-soft' : 'border-line-strong hover:border-accent/50',
            )}
          >
            {busy ? (
              <Loader2 className="size-7 animate-spin text-accent" />
            ) : (
              <Upload className="size-7 text-faint" />
            )}
            <div>
              <p className="text-sm font-medium text-ink">Drop files here, or click to browse</p>
              <p className="mt-1 text-[13px] text-muted">
                Images, MP4 video, PDF, and Markdown. Stored privately in your browser.
              </p>
            </div>
          </button>
        </div>
      )}

      {tab === 'text' && (
        <div className="space-y-4">
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lunch break"
            />
          </Field>
          <Field label="Message" hint="Markdown supported — # headings, **bold**, lists, links.">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder={'# Back at 2:00 PM\nGrab a coffee ☕'}
            />
          </Field>
        </div>
      )}
    </Modal>
  )
}

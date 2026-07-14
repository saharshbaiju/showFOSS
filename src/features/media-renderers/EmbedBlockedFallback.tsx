import { ExternalLink, RotateCw, ShieldAlert } from 'lucide-react'
import { hostnameOf } from '@/lib/media/detectType'

/**
 * Shown when a website almost certainly can't be embedded. Detecting this from
 * the parent frame is not fully reliable (the browser blocks reading a
 * cross-origin frame), so we surface a friendly explanation plus the one action
 * that always works — opening the site in a new tab.
 */
export function EmbedBlockedFallback({ url, onRetry }: { url: string; onRetry?: () => void }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-canvas px-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <ShieldAlert className="size-6" />
        </div>
        <h3 className="text-base font-semibold text-ink">This site won't embed</h3>
        <p className="mt-1.5 text-sm text-muted">
          <span className="font-data text-ink">{hostnameOf(url)}</span> blocks being shown inside
          another page. Open it in a new tab to display it live.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-ink shadow-soft hover:brightness-110"
          >
            <ExternalLink className="size-4" />
            Open in new tab
          </a>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink hover:bg-canvas"
            >
              <RotateCw className="size-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

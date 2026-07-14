const YT_ID_RE =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/

/** Extract an 11-char video id from any common YouTube URL, or a bare id. */
export function parseYouTubeId(input: string): string | null {
  const s = input.trim()
  const m = s.match(YT_ID_RE)
  if (m) return m[1]
  if (/^[\w-]{11}$/.test(s)) return s
  return null
}

export interface YouTubeEmbedOptions {
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
}

export function youTubeEmbedUrl(id: string, opts: YouTubeEmbedOptions = {}): string {
  const p = new URLSearchParams({
    autoplay: opts.autoplay ? '1' : '0',
    mute: opts.muted ? '1' : '0',
    controls: opts.controls ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
  })
  if (opts.loop) {
    p.set('loop', '1')
    p.set('playlist', id) // required for single-video loop
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`
}

export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

<div align="center">

# showFOSS

### Show Everything. Beautifully.

An open-source digital signage & presentation platform for college events,
hackathons, workshops, expos, and community stalls. Build a playlist of
websites, live leaderboards, posters, videos, PDFs, and announcements, then
launch a fullscreen show that cycles through them with smooth transitions.

100% client-side · No backend · No database · No sign-in · Deploys to Vercel as a static site.

</div>

---

## Highlights

- **Any content on screen** — websites & live leaderboards (auto-refreshing iframes), images, MP4 video, YouTube, PDFs, and Markdown announcements.
- **Drag-and-drop playlist** — reorder, duplicate, disable, search, shuffle, loop. Auto-saved locally.
- **A real on-air preview** — the editor shows your show playing live before you go fullscreen.
- **Presentation mode** — built for TVs & projectors: hidden UI, auto-hiding cursor, keyboard control.
- **Display modes** — slideshow, grid (2/4/6/9), split screen, picture-in-picture, and random showcase.
- **10 transitions** — fade, slide, zoom, scale, flip, blur, curtain, carousel, wave, and random.
- **Overlays** — live clock, countdown, event title & logo, sponsor banner, QR code, and a footer ticker.
- **Scheduling** — pin slides to times of day; the schedule takes over the screen automatically.
- **Themeable** — light/dark, a configurable accent color, and a custom presentation background.
- **Portable** — export/import your whole setup as a `.json` file.

## Keyboard shortcuts (presentation mode)

| Key | Action |
| --- | --- |
| `Esc` | Exit |
| `Space` | Pause / play |
| `←` | Previous |
| `→` | Next |
| `F` | Toggle fullscreen |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Build a static production bundle:

```bash
npm run build    # type-checks, then outputs to dist/
npm run preview  # serve the built site locally
```

## Deploy to Vercel

showFOSS is a static SPA — no server, no environment variables.

1. Push this repo to GitHub/GitLab and **Import** it in Vercel (framework auto-detects as **Vite**).
2. Build command `vite build`, output directory `dist` (both auto-filled).
3. Deploy.

`vercel.json` already rewrites all routes to `index.html` so `/present` and deep links resolve correctly. You can also deploy from the CLI with `vercel --prod`.

## How your data is stored

Everything lives in the browser — nothing is ever uploaded.

- **Playlist metadata, settings, and schedule** are saved in **LocalStorage** (auto-saved on every change).
- **Uploaded files** (images, videos, PDFs) are stored as blobs in **IndexedDB**, because LocalStorage caps at ~5 MB. This keeps large media fully offline without a backend.

Because uploaded files live in one browser, an exported `.json` playlist carries the *metadata* for those items but not their bytes — links, YouTube, and announcements travel fully; re-add uploaded files after importing on a new machine. Use **Settings → Data** to export/import, check storage usage, or request persistent storage.

## Notes & limitations

- **Website embedding:** some sites send `X-Frame-Options` / CSP `frame-ancestors` headers that forbid being shown in an iframe. This can't be reliably detected from the page (a browser security rule), so showFOSS always offers an **"Open in new tab"** button and shows a friendly fallback when a site clearly won't load. There's no client-side way around a site that refuses framing.
- **Autoplay:** browsers only autoplay **muted** video, so videos and YouTube start muted by default (toggle per-slide in the editor).

## Tech stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand · dnd-kit · React Router · React Hook Form · Lucide icons.

## Project structure

```
src/
├── app/                 # router, root layout, theme controller
├── components/
│   ├── brand/           # logo mark + wordmark
│   └── ui/              # design-system primitives (Button, Modal, Drawer, …)
├── features/
│   ├── media-renderers/ # per-type slide renderers + transition stage
│   ├── playlist/        # sortable playlist, add dialog, item editor
│   ├── presentation/    # the playback engine, player, controls
│   ├── display-modes/   # slideshow / grid / split / pip / random
│   ├── widgets/         # clock, countdown, QR, ticker, …
│   ├── schedule/        # time-based schedule editor
│   └── settings/        # appearance, playback, widgets, data
├── lib/                 # storage (IndexedDB), transitions, media parsers, hooks
├── store/               # Zustand stores (playlist, settings, schedule, runtime)
├── types/               # shared domain types
└── pages/               # DashboardPage, PresentPage, NotFoundPage
```

## License

MIT.

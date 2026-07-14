export {}

declare global {
  interface YTPlayer {
    destroy(): void
    playVideo(): void
    pauseVideo(): void
    mute(): void
    unMute(): void
  }

  interface YTPlayerOptions {
    videoId: string
    playerVars?: Record<string, string | number>
    events?: {
      onReady?: (event: { target: YTPlayer }) => void
      onStateChange?: (event: { data: number; target: YTPlayer }) => void
    }
  }

  interface Window {
    YT?: {
      Player: new (element: HTMLElement | string, options: YTPlayerOptions) => YTPlayer
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

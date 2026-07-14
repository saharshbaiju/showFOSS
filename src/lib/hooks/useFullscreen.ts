import { useCallback, useEffect, useState, type RefObject } from 'react'

export interface FullscreenApi {
  isFullscreen: boolean
  enter: () => Promise<void>
  exit: () => Promise<void>
  toggle: () => void
}

/** Thin wrapper over the Fullscreen API. Defaults to the document element. */
export function useFullscreen(target?: RefObject<HTMLElement | null>): FullscreenApi {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && !!document.fullscreenElement,
  )

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enter = useCallback(async () => {
    const el = target?.current ?? document.documentElement
    try {
      await el.requestFullscreen()
    } catch {
      /* user gesture required or unsupported — ignore */
    }
  }, [target])

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) void exit()
    else void enter()
  }, [enter, exit])

  return { isFullscreen, enter, exit, toggle }
}

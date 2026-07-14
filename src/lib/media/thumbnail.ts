const THUMB_W = 400
const THUMB_H = 225 // 16:9

function drawCover(src: CanvasImageSource, sw: number, sh: number): string | undefined {
  if (!sw || !sh) return undefined
  const canvas = document.createElement('canvas')
  canvas.width = THUMB_W
  canvas.height = THUMB_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  const scale = Math.max(THUMB_W / sw, THUMB_H / sh)
  const dw = sw * scale
  const dh = sh * scale
  ctx.fillStyle = '#0b0b0f'
  ctx.fillRect(0, 0, THUMB_W, THUMB_H)
  ctx.drawImage(src, (THUMB_W - dw) / 2, (THUMB_H - dh) / 2, dw, dh)
  try {
    return canvas.toDataURL('image/webp', 0.62)
  } catch {
    return undefined
  }
}

export async function makeImageThumbnail(blob: Blob): Promise<string | undefined> {
  try {
    const bitmap = await createImageBitmap(blob)
    const out = drawCover(bitmap, bitmap.width, bitmap.height)
    bitmap.close()
    return out
  } catch {
    return undefined
  }
}

export function makeVideoThumbnail(blob: Blob): Promise<string | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const video = document.createElement('video')
    video.muted = true
    video.preload = 'metadata'
    video.src = url
    const done = (val: string | undefined) => {
      URL.revokeObjectURL(url)
      resolve(val)
    }
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2)
    }
    video.onseeked = () => done(drawCover(video, video.videoWidth, video.videoHeight))
    video.onerror = () => done(undefined)
    // Safety timeout so a stubborn file never hangs the add flow.
    window.setTimeout(() => done(undefined), 4000)
  })
}

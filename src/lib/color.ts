function normalizeHex(hex: string): string {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  return h.length === 6 ? h : '000000'
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex)
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

/** WCAG relative luminance, 0 (black) .. 1 (white). */
export function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function isDark(hex: string): boolean {
  return relativeLuminance(hex) < 0.5
}

/** A high-contrast text color (near-white or near-black) for a given background. */
export function readableTextOn(hex: string): string {
  return isDark(hex) ? '#ffffff' : '#0b0b0f'
}

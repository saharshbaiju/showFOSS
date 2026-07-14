import type { StateStorage } from 'zustand/middleware'

/**
 * LocalStorage wrapper for Zustand's persist middleware that degrades
 * gracefully: if LocalStorage is unavailable (private mode) or a write
 * exceeds quota, we keep the session working from an in-memory map instead
 * of throwing. Metadata is small, so this is rarely hit — uploaded blobs
 * live in IndexedDB (see mediaStore), never here.
 */

const memory = new Map<string, string>()

function probe(): boolean {
  try {
    const k = '__showfoss_probe__'
    localStorage.setItem(k, '1')
    localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

const available = typeof window !== 'undefined' && probe()

export const safeStorage: StateStorage = {
  getItem: (name) => (available ? localStorage.getItem(name) : (memory.get(name) ?? null)),
  setItem: (name, value) => {
    try {
      if (available) localStorage.setItem(name, value)
      else memory.set(name, value)
    } catch (err) {
      memory.set(name, value)
      console.warn('[showFOSS] LocalStorage write failed; using memory fallback.', err)
    }
  },
  removeItem: (name) => {
    if (available) localStorage.removeItem(name)
    memory.delete(name)
  },
}

export const localStorageAvailable = available

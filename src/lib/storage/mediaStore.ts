import { get, set, del, keys, createStore } from 'idb-keyval'

/**
 * Binary media (uploaded images/videos/PDFs) is stored as Blobs in IndexedDB,
 * NOT LocalStorage — LocalStorage caps at ~5MB and only holds strings, so
 * base64-in-LocalStorage blows the quota on the first upload. IndexedDB stores
 * Blobs natively (no base64 inflation) with hundreds of MB of headroom, and
 * remains fully client-side (no backend), satisfying the offline requirement.
 *
 * Object URLs are created once per ref and cached; they are revoked centrally
 * when an item is deleted, so long-running signage sessions don't leak memory.
 */

const store = createStore('showfoss-media', 'blobs')
const urlCache = new Map<string, string>()

export async function putBlob(ref: string, blob: Blob): Promise<void> {
  await set(ref, blob, store)
}

export async function getBlob(ref: string): Promise<Blob | undefined> {
  return get<Blob>(ref, store)
}

export function revokeObjectUrl(ref: string): void {
  const url = urlCache.get(ref)
  if (url) {
    URL.revokeObjectURL(url)
    urlCache.delete(ref)
  }
}

export async function deleteBlob(ref: string): Promise<void> {
  revokeObjectUrl(ref)
  await del(ref, store)
}

export async function getObjectUrl(ref: string): Promise<string | null> {
  const cached = urlCache.get(ref)
  if (cached) return cached
  const blob = await getBlob(ref)
  if (!blob) return null
  const url = URL.createObjectURL(blob)
  urlCache.set(ref, url)
  return url
}

export async function listRefs(): Promise<string[]> {
  return (await keys(store)).map(String)
}

/** Delete IndexedDB blobs no longer referenced by any playlist item. */
export async function gcOrphans(referenced: Set<string>): Promise<number> {
  const all = await listRefs()
  let removed = 0
  for (const key of all) {
    if (!referenced.has(key)) {
      await del(key, store)
      revokeObjectUrl(key)
      removed++
    }
  }
  return removed
}

export async function estimateUsage(): Promise<{ usage: number; quota: number }> {
  if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
    const { usage, quota } = await navigator.storage.estimate()
    return { usage: usage ?? 0, quota: quota ?? 0 }
  }
  return { usage: 0, quota: 0 }
}

/** Ask the browser to keep our storage durable (best effort; iOS may still evict). */
export async function requestPersistence(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    try {
      return await navigator.storage.persist()
    } catch {
      return false
    }
  }
  return false
}

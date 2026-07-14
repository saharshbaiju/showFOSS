import { customAlphabet } from 'nanoid'

const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

/** Short, URL-safe, collision-resistant id, optionally namespaced. */
export function uid(prefix?: string): string {
  return prefix ? `${prefix}_${nano()}` : nano()
}

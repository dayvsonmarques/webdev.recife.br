// Fixed-window limiter kept in memory: enough for a single site container.
// Restarting the app resets it, which is acceptable for spam control.
const hits = new Map<string, { count: number; resetAt: number }>()

export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
  }
  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  entry.count += 1
  return entry.count <= limit
}

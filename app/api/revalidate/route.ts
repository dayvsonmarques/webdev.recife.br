import { timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CONTENT_TAG } from '@/lib/content'

function authorized(header: string | null) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || !header) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const received = Buffer.from(header)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

/** Called by the admin after content edits: drop cached content and pages so the next visit is fresh. */
export async function POST(request: Request) {
  if (!authorized(request.headers.get('authorization'))) {
    return Response.json({ ok: false }, { status: 401 })
  }
  revalidateTag(CONTENT_TAG, { expire: 0 })
  revalidatePath('/', 'layout')
  return Response.json({ ok: true })
}

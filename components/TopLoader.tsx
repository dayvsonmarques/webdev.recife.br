'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'loading' | 'done'

/**
 * Thin progress bar at the top of the page. Starts on the initial load and on
 * internal link clicks that change the pathname; completes when the new route renders.
 */
export function TopLoader() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('loading')
  const [progress, setProgress] = useState(15)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Trickle towards 90% while loading.
  useEffect(() => {
    if (phase !== 'loading') return
    timer.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p))
    }, 200)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [phase])

  // Route rendered (or first paint hydrated): finish, then fade out.
  useEffect(() => {
    const finish = setTimeout(() => {
      setProgress(100)
      setPhase('done')
    }, 0)
    const reset = setTimeout(() => {
      setPhase('idle')
      setProgress(0)
    }, 500)
    return () => {
      clearTimeout(finish)
      clearTimeout(reset)
    }
  }, [pathname])

  // Start on clicks to internal links that leave the current page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element).closest('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const url = new URL(anchor.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      setProgress(15)
      setPhase('loading')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      style={{ opacity: phase === 'idle' ? 0 : 1, transition: 'opacity 300ms ease 200ms' }}
    >
      <div
        className="h-full motion-reduce:transition-none"
        style={{
          width: `${progress}%`,
          background: 'var(--color-accent)',
          boxShadow: '0 0 8px var(--color-accent)',
          transition: phase === 'idle' ? 'none' : 'width 200ms ease-out',
        }}
      />
    </div>
  )
}

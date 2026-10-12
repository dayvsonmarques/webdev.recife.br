'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useInView } from '@/hooks/useInView'
import type { HeroSlide } from '@/lib/content'

const INTERVAL_MS = 6000

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(reducedMotionQuery).matches, () => false)

interface HeroProps {
  /** Visually hidden page heading; the slides are the visible message. */
  heading: string
  slides: HeroSlide[]
  /** Fixed offer pill above the rotating phrases (price, trial, no lock-in). */
  offer?: string
}

/** Banner carousel: rotates every few seconds, pauses on hover/focus, stops after manual navigation or for reduced motion. */
export function Hero({ heading, slides, offer }: HeroProps) {
  const { ref, isInView } = useInView()
  const [active, setActive] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const touchStartX = useRef<number | null>(null)

  const count = slides.length
  const rotating = count > 1 && !userPaused && !interacting && !reducedMotion
  const go = useCallback((delta: number) => setActive((i) => (i + delta + count) % count), [count])
  // Once the visitor navigates by hand, auto-rotation stops for good (WCAG 2.2.2: moving content can be stopped).
  const takeControl = (navigate: () => void) => {
    setUserPaused(true)
    navigate()
  }

  useEffect(() => {
    if (!rotating) return
    const timer = window.setInterval(() => go(1), INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [rotating, go])

  return (
    <section
      ref={ref}
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="min-h-[70svh] md:min-h-[88svh] flex flex-col justify-center transition-all duration-700 relative overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false)
      }}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (count > 1 && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-glow) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-5xl mx-auto w-full px-6 md:px-24 pt-28 pb-16 text-center">
        <h1 className="sr-only">{heading}</h1>

        {offer && (
          <p
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-sm font-semibold border"
            style={{ borderColor: 'var(--color-accent-2)', color: 'var(--color-text-primary)', borderRadius: '999px' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-accent-2)' }} aria-hidden="true" />
            {offer}
          </p>
        )}

        {/* Slides share one grid cell, so the block keeps the height of the tallest one. */}
        <div className="grid" aria-live={rotating ? 'off' : 'polite'}>
          {slides.map((slide, i) => {
            const isActive = i === active
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${count}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className="[grid-area:1/1] flex flex-col items-center justify-center motion-safe:transition-all motion-safe:duration-700"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                }}
              >
                <p
                  className="font-heading text-display font-extrabold max-w-4xl text-balance"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {slide.title}
                  {slide.highlight && (
                    <>
                      {' '}
                      <span style={{ color: 'var(--color-highlight)' }}>{slide.highlight}</span>
                    </>
                  )}
                </p>
                {slide.subtitle && (
                  <p className="text-lead mt-6 max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
                    {slide.subtitle}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {count > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => takeControl(() => setActive(i))}
                aria-label={`Ir para o destaque ${i + 1}`}
                aria-current={i === active}
                className="flex h-11 items-center px-1"
              >
                <span
                  className="block h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? '2.5rem' : '1rem',
                    backgroundColor: i === active ? 'var(--color-accent-2)' : 'var(--color-border)',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => takeControl(() => go(-1))}
            aria-label="Destaque anterior"
            className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => takeControl(() => go(1))}
            aria-label="Próximo destaque"
            className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center p-2 rounded-full motion-safe:animate-bounce transition-opacity hover:opacity-70 focus-visible:opacity-70"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v8m0 0l-5-5m5 5l5-5" />
          <path d="M12 13v6m0 0l-5-5m5 5l5-5" />
        </svg>
      </button>
    </section>
  )
}

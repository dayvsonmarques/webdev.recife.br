'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useInView } from '@/hooks/useInView'
import type { HeroSlide } from '@/lib/content'
import { cn } from '@/components/ui/cn'

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
  /** Offer line (price, trial, no lock-in); shown as the first slide's subtitle when it has none. */
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
      className={cn(
        'relative flex min-h-[72svh] flex-col justify-center overflow-hidden transition-[opacity,transform] duration-700 md:min-h-[92svh]',
        isInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      )}
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
      {/* Dot grid fading out toward the edges, and a soft glow behind the phrase. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--c-line) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, var(--c-glow) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-32 text-center md:px-28">
        <h1 className="sr-only">{heading}</h1>

        {/* Slides share one grid cell, so the block keeps the height of the tallest one. */}
        <div className="grid" aria-live={rotating ? 'off' : 'polite'}>
          {slides.map((slide, i) => {
            const isActive = i === active
            const subtitle = slide.subtitle || (i === 0 ? offer : undefined)
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${count}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className={cn(
                  'flex flex-col items-center justify-center [grid-area:1/1] motion-safe:transition-[opacity,transform] motion-safe:duration-700',
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                )}
              >
                <p className="max-w-5xl font-heading text-display font-extrabold tracking-[-0.03em] text-ink text-balance">
                  {slide.title}
                  {slide.highlight && (
                    <>
                      {' '}
                      <span className="text-highlight">{slide.highlight}</span>
                    </>
                  )}
                </p>
                {subtitle && <p className="mt-8 max-w-2xl text-lead text-muted">{subtitle}</p>}
              </div>
            )
          })}
        </div>

        {count > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => takeControl(() => setActive(i))}
                aria-label={`Ir para o destaque ${i + 1}`}
                aria-current={i === active}
                className="flex h-11 items-center px-1"
              >
                <span className={cn('block h-1 rounded-pill transition-all duration-300', i === active ? 'w-12 bg-gold' : 'w-5 bg-line')} />
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
            className="absolute left-6 top-1/2 hidden -translate-y-1/2 items-center justify-center p-1 text-ink opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 md:flex"
          >
            <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => takeControl(() => go(1))}
            aria-label="Próximo destaque"
            className="absolute right-6 top-1/2 hidden -translate-y-1/2 items-center justify-center p-1 text-ink opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 md:flex"
          >
            <svg className="h-20 w-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-pill p-2 text-muted transition-opacity hover:opacity-70 focus-visible:opacity-70 motion-safe:animate-bounce md:bottom-10"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v8m0 0l-5-5m5 5l5-5" />
          <path d="M12 13v6m0 0l-5-5m5 5l5-5" />
        </svg>
      </button>
    </section>
  )
}

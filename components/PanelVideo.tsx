'use client'

import { useEffect, useRef, useState } from 'react'
import { iconFor } from '@/components/feature-icons'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { PanelVideo as Clip } from '@/lib/product-gallery'

/** Clip of the store's admin panel in a browser frame: plays while on screen, never with reduced motion. */
export function PanelVideo({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  // Pausing by hand wins over the on-screen autoplay.
  const pausedByUser = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByUser.current) void video.play().catch(() => {})
        else if (!entry.isIntersecting) video.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    pausedByUser.current = !video.paused
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <Section tone="surface" aria-label={clip.title}>
      <Container className="flex flex-col gap-14">
        <SectionHeader eyebrow="Painel da loja" title={clip.title} intro={clip.intro} />
        <div className="overflow-hidden rounded-lg border border-line bg-bg shadow-lift">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-hidden="true">
            <span className="h-3 w-3 rounded-pill bg-line" />
            <span className="h-3 w-3 rounded-pill bg-line" />
            <span className="h-3 w-3 rounded-pill bg-line" />
          </div>
          <div className="relative">
            <video
              ref={videoRef}
              className="block aspect-[1120/700] w-full bg-surface object-cover"
              muted
              loop
              playsInline
              preload="none"
              poster={clip.poster}
              aria-label={clip.label}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={clip.webm} type="video/webm" />
              <source src={clip.mp4} type="video/mp4" />
            </video>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
              </svg>
            </button>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {clip.highlights.map((item) => (
            <li key={item} className="flex items-center gap-3 text-base font-medium text-ink [&_svg]:h-6 [&_svg]:w-6 [&_svg]:shrink-0 [&_svg]:text-gold">
              {iconFor(item)}
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

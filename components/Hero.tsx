'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  // Respeita quem prefere menos movimento: mantém só o poster.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause()
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <div className="relative mx-auto w-full max-w-[18rem] lg:max-w-[20rem]">
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.08) 55%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="relative aspect-[9/16] overflow-hidden border-4"
        style={{
          borderColor: 'var(--color-border)',
          borderRadius: '2.25rem',
          backgroundColor: 'var(--color-surface)',
          boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)',
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
          aria-label="Pessoa navegando numa loja online pelo celular"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(10,10,10,0.6)', color: '#FFFFFF' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
          </svg>
        </button>
      </div>
      <div
        aria-hidden="true"
        className="absolute -left-6 bottom-12 flex items-center gap-2 px-4 py-2.5 text-sm font-medium shadow-lg"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-accent-2)' }} />
        Novo pedido recebido
      </div>
    </div>
  )
}

interface HeroProps {
  title: string
  highlight: string
  subtitle: string
  cta: string
}

export function Hero({ title, highlight, subtitle, cta }: HeroProps) {
  const { ref, isInView } = useInView()

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col justify-center transition-all duration-700 relative overflow-hidden"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1
              className="font-syne text-display font-extrabold mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {title}{' '}
              <span style={{ color: 'var(--color-accent)' }}>{highlight}</span>
            </h1>

            <p className="text-lead mb-10 max-w-lg" style={{ color: 'var(--color-text-muted)' }}>
              {subtitle}
            </p>

            <a
              href="#contato"
              className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-fg)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {cta}
            </a>
          </div>

          <HeroVideo />
        </div>
      </div>
    </section>
  )
}

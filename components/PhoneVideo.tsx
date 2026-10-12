'use client'

import { useEffect, useRef, useState } from 'react'

/** Phone mockup with a muted looping video of someone shopping in an online store. */
export function PhoneVideo() {
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
          background: 'radial-gradient(circle, var(--color-glow) 0%, transparent 72%)',
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


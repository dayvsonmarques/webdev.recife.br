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
        className="pointer-events-none absolute -inset-10 rounded-full blur-[40px]"
        style={{ background: 'radial-gradient(circle, var(--c-glow) 0%, transparent 72%)' }}
      />
      <div className="relative aspect-[9/16] max-w-full overflow-hidden rounded-[2.25rem] border-4 border-line bg-surface shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
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
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
          </svg>
        </button>
      </div>
      <div
        aria-hidden="true"
        className="absolute -left-6 bottom-12 flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-lift"
      >
        <span className="h-2 w-2 rounded-full bg-gold" />
        Novo pedido recebido
      </div>
    </div>
  )
}


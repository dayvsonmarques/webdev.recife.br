'use client'

import { useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Respeita quem prefere menos movimento: mantém só o poster.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause()
  }, [])

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
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div
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

export function Hero() {
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
              <span className="whitespace-nowrap">Seu negócio</span><br />no digital{' '}
              <br className="hidden md:block" />—{' '}
              <span style={{ color: 'var(--color-accent)' }}>sem complicação.</span>
            </h1>

            <p className="text-lead mb-10 max-w-lg" style={{ color: 'var(--color-text-muted)' }}>
              Do cardápio à loja online: a gente monta, publica e cuida do seu site enquanto você cuida
              do negócio.
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
              Entrar em contato
            </a>
          </div>

          <HeroVideo />
        </div>
      </div>
    </section>
  )
}

'use client'

import { useInView } from '@/hooks/useInView'

export function Hero() {
  const { ref, isInView } = useInView()

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col justify-center transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12 pt-28 pb-20">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-8"
          style={{ color: 'var(--color-accent)' }}
        >
          Web Dev Recife
        </p>

        <div className="max-w-3xl">
          <h1
            className="font-syne text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-8"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Seu negócio no digital{' '}
            <br className="hidden md:block" />—{' '}
            <span style={{ color: 'var(--color-accent)' }}>sem complicação.</span>
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-8"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
          </p>

          <a
            href="#contato"
            className="inline-block px-8 py-4 font-syne font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#0A0A0A',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Entrar em contato
          </a>
        </div>
      </div>
    </section>
  )
}

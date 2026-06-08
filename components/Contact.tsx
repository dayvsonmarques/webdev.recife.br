'use client'

import { useInView } from '@/hooks/useInView'

export function Contact() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="contato"
      ref={ref}
      className="py-32 transition-all duration-700"
      style={{
        backgroundColor: 'var(--color-surface)',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-6"
          style={{ color: 'var(--color-accent)' }}
        >
          Vamos conversar
        </p>

        <h2
          className="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Tem um projeto em mente?
        </h2>

        <p
          className="text-xl mb-12 max-w-md"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Conta o que você precisa.
        </p>

        <a
          href="https://wa.me/55"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 font-syne font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#0A0A0A',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Falar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}

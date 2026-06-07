'use client'

import { useInView } from '@/hooks/useInView'

export function Contact() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="contato"
      ref={ref}
      className="py-24 px-6 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-2xl">
        <h2
          className="font-syne text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Tem um projeto em mente?
        </h2>
        <p
          className="text-lg mb-10"
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

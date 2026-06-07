'use client'

import { useInView } from '@/hooks/useInView'

export function Hero() {
  const { ref, isInView } = useInView()

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 md:px-12 lg:px-24 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-4xl">
        <h1
          className="font-syne text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Seu negócio no digital{' '}
          <br className="hidden md:block" />—{' '}
          <span style={{ color: 'var(--color-accent)' }}>sem complicação.</span>
        </h1>

        <p
          className="text-lg md:text-xl leading-relaxed mb-4 max-w-2xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
        </p>

        <p
          className="text-base leading-relaxed mb-10 max-w-2xl"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Negócio local não precisa esperar meses nem pagar por algo construído do zero. As soluções são baseadas em plataformas consolidadas, adaptadas pra realidade do seu negócio — você sai do papel rápido, com um sistema que já foi testado e funciona.
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
          Falar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}

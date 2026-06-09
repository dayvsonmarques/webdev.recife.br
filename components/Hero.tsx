'use client'

import { useInView } from '@/hooks/useInView'

function HeroVisual() {
  return (
    <div
      className="relative flex items-center justify-center w-full h-full py-8"
      aria-hidden="true"
    >
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,255,87,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <svg
        viewBox="0 0 440 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full max-w-md"
      >
        <circle cx="220" cy="220" r="180" stroke="rgba(212,255,87,0.05)" strokeWidth="1" />
        <circle cx="220" cy="220" r="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="220" cy="220" r="120" stroke="rgba(212,255,87,0.1)" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="220" cy="220" r="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <circle cx="220" cy="220" r="58" stroke="rgba(212,255,87,0.22)" strokeWidth="1.5" />

        <line x1="40" y1="220" x2="400" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="220" y1="40" x2="220" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

        <circle cx="220" cy="70" r="5" fill="#D4FF57" opacity="0.9" />
        <circle cx="370" cy="220" r="4" fill="#D4FF57" opacity="0.6" />
        <circle cx="220" cy="310" r="3" fill="#D4FF57" opacity="0.4" />
        <circle cx="100" cy="220" r="3" fill="rgba(255,255,255,0.35)" />
        <circle cx="308" cy="132" r="4" fill="rgba(212,255,87,0.55)" />
        <circle cx="132" cy="308" r="3" fill="rgba(255,255,255,0.2)" />

        <line x1="220" y1="213" x2="220" y2="75" stroke="rgba(212,255,87,0.25)" strokeWidth="1" />
        <line x1="227" y1="220" x2="365" y2="220" stroke="rgba(212,255,87,0.2)" strokeWidth="1" />
        <line x1="225" y1="215" x2="303" y2="137" stroke="rgba(212,255,87,0.2)" strokeWidth="1" />

        <circle cx="220" cy="220" r="16" stroke="rgba(212,255,87,0.35)" strokeWidth="1.5" />
        <circle cx="220" cy="220" r="7" fill="#D4FF57" opacity="0.95" />

        {([
          [55, 55], [155, 55], [285, 55], [385, 55],
          [55, 140], [385, 140],
          [55, 300], [385, 300],
          [55, 385], [155, 385], [285, 385], [385, 385],
          [55, 220], [385, 220],
        ] as [number, number][]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="rgba(255,255,255,0.1)" />
        ))}

        <circle cx="55" cy="55" r="3.5" fill="rgba(212,255,87,0.3)" />
        <circle cx="385" cy="385" r="3" fill="rgba(212,255,87,0.2)" />
        <circle cx="385" cy="55" r="2.5" fill="rgba(255,255,255,0.15)" />
        <circle cx="55" cy="385" r="2" fill="rgba(255,255,255,0.1)" />
      </svg>
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
            <p
              className="text-sm font-bold tracking-widest uppercase mb-8"
              style={{ color: 'var(--color-accent)' }}
            >
              Web Dev Recife
            </p>

            <h1
              className="font-syne text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-8"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Seu negócio no digital{' '}
              <br className="hidden md:block" />—{' '}
              <span style={{ color: 'var(--color-accent)' }}>sem complicação.</span>
            </h1>

            <p
              className="text-xl md:text-2xl leading-relaxed mb-10"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.
            </p>

            <a
              href="#contato"
              className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#0A0A0A',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Entrar em contato
            </a>
          </div>

          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

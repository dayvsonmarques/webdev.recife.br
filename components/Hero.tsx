'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useInView } from '@/hooks/useInView'

const DARK_C = {
  glow:        'radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)',
  ring1:       'rgba(124,58,237,0.22)',
  ring2:       'rgba(124,58,237,0.12)',
  ring3:       'rgba(124,58,237,0.18)',
  ring4:       'rgba(255,255,255,0.04)',
  ring5:       'rgba(124,58,237,0.35)',
  axis:        'rgba(255,255,255,0.04)',
  dot:         '#7C3AED',
  dotMuted:    'rgba(255,255,255,0.25)',
  dotMuted2:   'rgba(255,255,255,0.15)',
  gridDot:     'rgba(124,58,237,0.15)',
  lineAccent:  'rgba(124,58,237,0.35)',
  lineAccent2: 'rgba(124,58,237,0.25)',
  centerRing:  'rgba(124,58,237,0.50)',
  centerDot:   '#7C3AED',
  corner:      'rgba(212,255,87,0.40)',   // Acid como toque secundário
  cornerFade:  'rgba(124,58,237,0.20)',
}

const LIGHT_C = {
  glow:        'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(212,255,87,0.10) 50%, transparent 70%)',
  ring1:       'rgba(124,58,237,0.40)',
  ring2:       'rgba(124,58,237,0.25)',
  ring3:       'rgba(124,58,237,0.30)',
  ring4:       'rgba(0,0,0,0.08)',
  ring5:       'rgba(124,58,237,0.55)',
  axis:        'rgba(0,0,0,0.07)',
  dot:         '#7C3AED',
  dotMuted:    'rgba(0,0,0,0.25)',
  dotMuted2:   'rgba(0,0,0,0.15)',
  gridDot:     'rgba(124,58,237,0.18)',
  lineAccent:  'rgba(124,58,237,0.35)',
  lineAccent2: 'rgba(124,58,237,0.25)',
  centerRing:  'rgba(124,58,237,0.60)',
  centerDot:   '#7C3AED',
  corner:      'rgba(124,58,237,0.35)',
  cornerFade:  'rgba(0,0,0,0.12)',
}

function HeroVisual() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const c = (mounted && resolvedTheme === 'light') ? LIGHT_C : DARK_C

  return (
    <div
      className="relative flex items-center justify-center w-full h-full py-8"
      aria-hidden="true"
    >
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{ background: c.glow, filter: 'blur(60px)' }}
      />
      <svg
        viewBox="0 0 440 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full max-w-md"
      >
        <circle cx="220" cy="220" r="180" stroke={c.ring1} strokeWidth="1" />
        <circle cx="220" cy="220" r="150" stroke={c.ring2} strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="220" cy="220" r="120" stroke={c.ring3} strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="220" cy="220" r="90"  stroke={c.ring4} strokeWidth="1" />
        <circle cx="220" cy="220" r="58"  stroke={c.ring5} strokeWidth="1.5" />

        <line x1="40"  y1="220" x2="400" y2="220" stroke={c.axis} strokeWidth="1" />
        <line x1="220" y1="40"  x2="220" y2="400" stroke={c.axis} strokeWidth="1" />

        <circle cx="220" cy="70"  r="5" fill={c.dot}      opacity="0.9" />
        <circle cx="370" cy="220" r="4" fill={c.dot}      opacity="0.6" />
        <circle cx="220" cy="310" r="3" fill={c.dot}      opacity="0.4" />
        <circle cx="100" cy="220" r="3" fill={c.dotMuted} />
        <circle cx="308" cy="132" r="4" fill={c.dot}      opacity="0.55" />
        <circle cx="132" cy="308" r="3" fill={c.dotMuted2} />

        <line x1="220" y1="213" x2="220" y2="75"  stroke={c.lineAccent}  strokeWidth="1" />
        <line x1="227" y1="220" x2="365" y2="220" stroke={c.lineAccent2} strokeWidth="1" />
        <line x1="225" y1="215" x2="303" y2="137" stroke={c.lineAccent2} strokeWidth="1" />

        <circle cx="220" cy="220" r="16" stroke={c.centerRing} strokeWidth="1.5" />
        <circle cx="220" cy="220" r="7"  fill={c.centerDot}   opacity="0.95" />

        {([
          [55, 55], [155, 55], [285, 55], [385, 55],
          [55, 140], [385, 140],
          [55, 300], [385, 300],
          [55, 385], [155, 385], [285, 385], [385, 385],
          [55, 220], [385, 220],
        ] as [number, number][]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill={c.gridDot} />
        ))}

        <circle cx="55"  cy="55"  r="3.5" fill={c.corner} />
        <circle cx="385" cy="385" r="3"   fill={c.corner}      opacity="0.6" />
        <circle cx="385" cy="55"  r="2.5" fill={c.cornerFade} />
        <circle cx="55"  cy="385" r="2"   fill={c.cornerFade}  opacity="0.7" />
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
            <h1
              className="font-syne text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-8"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <span className="whitespace-nowrap">Seu negócio</span><br />no digital{' '}
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
                color: 'var(--color-accent-fg)',
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

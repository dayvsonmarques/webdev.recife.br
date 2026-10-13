'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

/** Lightweight alternative to the full quote form — just send a message. */
export function QuickContact() {
  const { ref, isInView } = useInView()

  return (
    <section
      ref={ref}
      className="py-28 transition-all duration-700"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 text-center">
        <p
          className="text-eyebrow font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent-text)' }}
        >
          Contato rápido
        </p>
        <h2
          className="font-heading text-heading font-bold mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Prefere só mandar uma mensagem?
        </h2>
        <p className="text-lead mb-10 mx-auto max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
          Sem compromisso — conta o que você precisa e a gente te responde rapidinho.
        </p>
        <Link
          href="/fale-conosco"
          className="inline-block px-8 py-4 font-heading font-bold text-base tracking-wide border-2 transition-colors hover:border-[var(--color-accent-text)]"
          style={{ borderColor: 'var(--color-text-primary)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)' }}
        >
          Enviar mensagem
        </Link>
      </div>
    </section>
  )
}

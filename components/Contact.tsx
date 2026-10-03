'use client'

import { useInView } from '@/hooks/useInView'

interface ContactProps {
  eyebrow: string
  title: string
  text: string
  cta: string
  /** wa.me link; the button is hidden until a WhatsApp number is set in the admin. */
  whatsappHref: string | null
}

export function Contact({ eyebrow, title, text, cta, whatsappHref }: ContactProps) {
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
          className="text-eyebrow font-bold tracking-widest uppercase mb-6"
          style={{ color: 'var(--color-accent-text)' }}
        >
          {eyebrow}
        </p>

        <h2
          className="font-syne text-title font-extrabold leading-tight mb-6 max-w-xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h2>

        <p
          className="text-lead mb-12 max-w-md"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {text}
        </p>

        {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {cta}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
        )}
      </div>
    </section>
  )
}

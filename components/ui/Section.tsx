'use client'

import type { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from './cn'

interface SectionProps {
  id?: string
  children: ReactNode
  /** `surface` sets the section on the alternate band color. */
  tone?: 'default' | 'surface'
  className?: string
  'aria-label'?: string
}

/** Vertical rhythm for every page section, with a gentle reveal when it scrolls into view. */
export function Section({ id, children, tone = 'default', className, ...rest }: SectionProps) {
  const { ref, isInView } = useInView()
  return (
    <section
      id={id}
      ref={ref}
      aria-label={rest['aria-label']}
      className={cn(
        'py-section transition-[opacity,transform] duration-700 ease-out',
        tone === 'surface' && 'bg-surface',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      )}
    >
      {children}
    </section>
  )
}

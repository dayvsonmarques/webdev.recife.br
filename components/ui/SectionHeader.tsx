import type { ReactNode } from 'react'
import { cn } from './cn'
import { Eyebrow } from './Eyebrow'

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  /** Heading level: h1 on standalone pages, h2 inside the home. */
  as?: 'h1' | 'h2'
  size?: 'heading' | 'title'
  className?: string
}

/** Eyebrow + title + intro, the opening of every section. */
export function SectionHeader({ eyebrow, title, intro, align = 'left', as: Tag = 'h2', size = 'heading', className }: SectionHeaderProps) {
  const centered = align === 'center'
  return (
    <header className={cn('flex flex-col gap-6', centered && 'items-center text-center', className)}>
      {eyebrow && <Eyebrow centered={centered}>{eyebrow}</Eyebrow>}
      <Tag className={cn('font-heading font-bold text-ink max-w-4xl', size === 'title' ? 'text-title font-extrabold' : 'text-heading')}>{title}</Tag>
      {intro && <p className={cn('text-lead text-muted max-w-2xl', centered && 'mx-auto')}>{intro}</p>}
    </header>
  )
}

import { cn } from '@/components/ui/cn'

/** Chevron with rounded caps, as drawn on the business card: taller and lighter than the letters. */
function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 24" className="h-[1.1em] w-auto" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={flip ? 'M2 2l8 10-8 10' : 'M10 2L2 12l8 10'} />
    </svg>
  )
}

/** Wordmark `< web dev />` from the business card (Gemunu Libre + drawn brackets). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[0.28em] whitespace-nowrap font-logo font-bold leading-none tracking-[0.01em] text-gold', className)}>
      <Chevron />
      <span className="translate-y-[0.04em]">web dev</span>
      {/* "/>" fica junto, como no cartão; a barra tem o peso das letras */}
      <span className="inline-flex items-center gap-[0.12em]">
        <svg viewBox="0 0 8 24" className="h-[1.1em] w-auto" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <path d="M6 2.5L2 21.5" />
        </svg>
        <Chevron flip />
      </span>
    </span>
  )
}

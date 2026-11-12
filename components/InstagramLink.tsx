import { INSTAGRAM } from '@/lib/social'
import { cn } from '@/components/ui/cn'

/** "@webdevrecife" with the Instagram glyph (or the glyph alone, larger); opens the profile in a new tab. */
export function InstagramLink({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  const size = iconOnly ? 36 : 20
  return (
    <a
      href={INSTAGRAM.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex min-h-11 min-w-11 items-center gap-2.5 text-base text-muted transition-colors hover:text-ink', className)}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
      {iconOnly ? (
        <span className="sr-only">Instagram {INSTAGRAM.handle} (abre em nova aba)</span>
      ) : (
        <span>
          <span className="sr-only">Instagram </span>
          {INSTAGRAM.handle}
          <span className="sr-only"> (abre em nova aba)</span>
        </span>
      )}
    </a>
  )
}

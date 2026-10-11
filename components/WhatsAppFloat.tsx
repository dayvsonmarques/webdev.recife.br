/** Always-visible WhatsApp shortcut (bottom-right) on every page. */
export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp (abre em nova aba)"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 md:bottom-8 md:right-8 md:h-16 md:w-16"
      style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
        <path d="M16.02 3C8.86 3 3.04 8.82 3.04 15.98c0 2.29.6 4.52 1.74 6.49L3 29l6.7-1.75a12.93 12.93 0 0 0 6.31 1.62h.01c7.16 0 12.98-5.82 12.98-12.98 0-3.47-1.35-6.73-3.8-9.18A12.9 12.9 0 0 0 16.02 3Zm0 23.73h-.01c-1.94 0-3.84-.52-5.5-1.5l-.39-.23-3.98 1.04 1.06-3.88-.26-.4a10.76 10.76 0 0 1-1.65-5.78c0-5.95 4.84-10.79 10.8-10.79 2.88 0 5.59 1.12 7.63 3.16a10.72 10.72 0 0 1 3.15 7.63c0 5.95-4.84 10.79-10.85 10.79Zm5.92-8.08c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.21.32-.84 1.06-1.03 1.27-.19.22-.38.24-.7.08-.32-.16-1.37-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.49-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.69s1.16 3.12 1.32 3.33c.16.22 2.28 3.48 5.53 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.92-.78 2.19-1.54.27-.76.27-1.41.19-1.54-.08-.14-.3-.22-.62-.38Z" />
      </svg>
    </a>
  )
}

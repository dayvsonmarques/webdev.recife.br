export function Footer({ text }: { text: string }) {
  return (
    <footer
      className="py-8"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
          {text}
        </p>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">

        <section className="min-h-screen flex flex-col justify-center items-center text-center pt-28 pb-20 px-6">
          <p
            className="text-eyebrow font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-accent-text)' }}
          >
            404
          </p>
          <h1
            className="font-syne text-heading font-extrabold mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Página não encontrada
          </h1>
          <p
            className="text-lead mb-10 max-w-md"
            style={{ color: 'var(--color-text-muted)' }}
          >
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 font-syne font-bold text-base tracking-wide transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-fg)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Voltar para a página inicial
          </Link>
        </section>

      </main>

      <Footer />
    </>
  )
}

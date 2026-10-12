import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { QuoteForm } from '@/components/QuoteForm'
import { getSiteContent } from '@/lib/content'
import { PRECISA_EXTRAS } from '@/lib/quote-options'

export const metadata: Metadata = {
  title: 'Pedir orçamento — Web Dev Recife',
  description: 'Conte sobre seu negócio e receba um orçamento para sua loja online, cardápio digital ou site.',
}

export default async function OrcamentoPage() {
  const { config, services } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none pt-32 pb-28">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <p className="text-eyebrow font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-accent-text)' }}>
            Orçamento
          </p>
          <h1 className="font-heading text-heading font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Conte sobre seu negócio
          </h1>
          <p className="text-lead mb-14" style={{ color: 'var(--color-text-muted)' }}>
            Leva uns 3 minutos. Com essas respostas a gente monta um orçamento sob medida e fala com você pelo WhatsApp.
          </p>
          <QuoteForm products={[...services.map((s) => s.title), ...PRECISA_EXTRAS]} />
        </div>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}

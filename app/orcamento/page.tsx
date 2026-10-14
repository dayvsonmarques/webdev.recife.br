import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { QuoteForm } from '@/components/QuoteForm'
import { getSiteContent } from '@/lib/content'
import { PRECISA_EXTRAS } from '@/lib/quote-options'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Solicitar orçamento — Web Dev Recife',
  description: 'Conte sobre seu negócio e receba um orçamento para sua loja online, cardápio digital ou site.',
  path: '/orcamento',
})

export default async function OrcamentoPage() {
  const { config, services } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none pb-section pt-40">
        <Container narrow>
          <SectionHeader
            as="h1"
            eyebrow="Orçamento"
            title="Conte sobre seu negócio"
            intro="Leva uns 3 minutos. Com essas respostas a gente monta um orçamento sob medida e fala com você pelo WhatsApp."
            className="mb-16"
          />
          <QuoteForm products={[...services.map((s) => s.title), ...PRECISA_EXTRAS]} />
        </Container>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}

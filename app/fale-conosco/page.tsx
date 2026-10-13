import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSiteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Fale conosco — Web Dev Recife',
  description: 'Mande uma mensagem rápida e a gente responde em até 2 dias úteis.',
}

export default async function FaleConoscoPage() {
  const { config } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none pb-section pt-40">
        <Container narrow>
          <SectionHeader
            as="h1"
            eyebrow="Contato"
            title="Fale conosco"
            intro="Tem uma dúvida rápida ou prefere não preencher o formulário completo de orçamento? Manda uma mensagem."
            className="mb-16"
          />
          <ContactForm />
        </Container>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}

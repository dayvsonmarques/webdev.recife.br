import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
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
      <main id="conteudo" tabIndex={-1} className="outline-none pt-32 pb-28">
        <div className="max-w-2xl mx-auto px-6 md:px-8">
          <p className="text-eyebrow font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-accent-text)' }}>
            Contato
          </p>
          <h1 className="font-heading text-heading font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Fale conosco
          </h1>
          <p className="text-lead mb-14" style={{ color: 'var(--color-text-muted)' }}>
            Tem uma dúvida rápida ou prefere não preencher o formulário completo de orçamento? Manda uma mensagem.
          </p>
          <ContactForm />
        </div>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}

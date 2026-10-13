import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSiteContent } from '@/lib/content'

export default async function NotFound() {
  const { config } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <section className="flex min-h-[80svh] flex-col items-center justify-center gap-10 px-6 pb-20 pt-36 text-center">
          <SectionHeader
            as="h1"
            align="center"
            eyebrow="Erro 404"
            title="Página não encontrada"
            intro="O endereço que você tentou acessar não existe ou foi movido."
          />
          <ButtonLink href="/" arrow>
            Voltar para a página inicial
          </ButtonLink>
        </section>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}

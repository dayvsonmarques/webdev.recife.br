import type { Metadata } from 'next'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSiteContent, WHATSAPP_MESSAGE, whatsappLink } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteContent()
  // aboutText has paragraph breaks; previews and search snippets need one line.
  return pageMetadata({ title: 'Sobre — Web Dev Recife', description: `${config.aboutTitle} ${config.aboutText}`.replace(/\s+/g, ' '), path: '/sobre' })
}

export default async function SobrePage() {
  const { config: c } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <About eyebrow={c.aboutEyebrow} title={c.aboutTitle} text={c.aboutText} indicators={c.aboutIndicators} as="h1" />
        <Contact
          eyebrow={c.contactEyebrow}
          title={c.contactTitle}
          text={c.contactText}
          cta={c.contactCta}
          whatsappHref={whatsappLink(c.whatsappNumber, WHATSAPP_MESSAGE)}
        />
      </main>
      <Footer text={c.footerText} />
    </>
  )
}

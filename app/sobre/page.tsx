import type { Metadata } from 'next'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Services } from '@/components/Services'
import { getSiteContent, whatsappLink } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteContent()
  return { title: `${config.aboutTitle} — Web Dev Recife`, description: config.aboutText }
}

export default async function SobrePage() {
  const { config: c, catalog } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <About eyebrow={c.aboutEyebrow} title={c.aboutTitle} text={c.aboutText} indicators={c.aboutIndicators} as="h1" />
        <Services eyebrow={c.servicesEyebrow} title={c.servicesTitle} intro={c.servicesIntro} catalog={catalog} />
        <Contact
          eyebrow={c.contactEyebrow}
          title={c.contactTitle}
          text={c.contactText}
          cta={c.contactCta}
          whatsappHref={whatsappLink(c.whatsappNumber)}
        />
      </main>
      <Footer text={c.footerText} />
    </>
  )
}

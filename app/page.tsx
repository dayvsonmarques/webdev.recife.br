import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Products } from '@/components/Products'
import { Projects } from '@/components/Projects'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { formatPrice, getSiteContent, offerLine, startingPrice, whatsappLink } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

// Seção de projetos oculta até termos cases para mostrar.
const SHOW_PROJECTS = false
// Product pitched with the phone video at the top of the Products section.
const FEATURED_PRODUCT = 'loja-online'

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteContent()
  return pageMetadata({ title: config.seoTitle, description: config.seoDescription, path: '/' })
}

export default async function Home() {
  const { config: c, services, plans } = await getSiteContent()
  const from = startingPrice(plans)

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero heading={c.seoTitle} slides={c.heroSlides} offer={offerLine(plans, c.trialDays)} />
        <Products
          eyebrow={c.productsEyebrow}
          title={c.productsTitle}
          intro={c.productsIntro}
          services={services}
          featured={services.find((s) => s.slug === FEATURED_PRODUCT)}
          startingPrice={from === null ? undefined : formatPrice(from)}
        />
        {SHOW_PROJECTS && <Projects />}
        <About
          eyebrow={c.aboutEyebrow}
          title={c.aboutTitle}
          text={c.aboutText}
          indicators={c.aboutIndicators}
          cta={{ href: '/sobre', label: 'Conheça o estúdio' }}
        />
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

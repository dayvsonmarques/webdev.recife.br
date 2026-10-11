import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Products } from '@/components/Products'
import { Projects } from '@/components/Projects'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { getSiteContent, whatsappLink } from '@/lib/content'

// Seção de projetos oculta até termos cases para mostrar.
const SHOW_PROJECTS = false

export default async function Home() {
  const { config: c, services } = await getSiteContent()

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero title={c.heroTitle} highlight={c.heroHighlight} subtitle={c.heroSubtitle} cta={c.heroCta} />
        <Products eyebrow={c.productsEyebrow} title={c.productsTitle} intro={c.productsIntro} services={services} />
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

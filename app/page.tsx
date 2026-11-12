import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Products } from '@/components/Products'
import { Projects } from '@/components/Projects'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { formatPrice, getSiteContent, startingPrice, WHATSAPP_MESSAGE, whatsappLink } from '@/lib/content'
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
        <Hero
          heading={c.seoTitle}
          slides={c.heroSlides}
          offer={
            <>
              {/* Cada trecho não quebra no meio; o espaço entre eles fica fora, para a linha poder quebrar ali. */}
              {c.trialDays > 0 && <><span className="whitespace-nowrap">{c.trialDays} dias grátis ·</span>{' '}</>}
              {from !== null && (
                <>
                  <span className="whitespace-nowrap">
                    A partir de <strong className="font-heading text-subheading font-extrabold text-ink">{formatPrice(from)}/mês</strong>
                  </span>{' '}
                </>
              )}
              <span className="whitespace-nowrap">· Sem fidelidade</span>
            </>
          }
        />
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
          cta={{ href: '/sobre', label: 'Saiba mais' }}
        />
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

import type { Metadata } from 'next'
import { Gemunu_Libre, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { TopLoader } from '@/components/TopLoader'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { getSiteContent, WHATSAPP_MESSAGE, whatsappLink } from '@/lib/content'
import { SITE_URL } from '@/lib/site-url'
import { INSTAGRAM } from '@/lib/social'
import './globals.scss'

// Fontes do cartão de visita: Space Grotesk nos textos e títulos, Gemunu Libre só no logo.
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-var',
  display: 'swap',
})

const logo = Gemunu_Libre({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-logo-var',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteContent()
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: config.seoTitle, template: `%s` },
    description: config.seoDescription,
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      url: SITE_URL,
      siteName: 'Web Dev Recife',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: config.seoTitle,
      description: config.seoDescription,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { config } = await getSiteContent()
  const whatsappHref = whatsappLink(config.whatsappNumber, WHATSAPP_MESSAGE)

  return (
    // Font variables live on <html>: the theme resolves --font-heading/--font-body at :root.
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${grotesk.variable} ${logo.variable}`}
    >
      <body className="font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Web Dev Recife',
              url: SITE_URL,
              description: config.seoDescription,
              areaServed: { '@type': 'Country', name: 'Brasil' },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Recife',
                addressRegion: 'PE',
                addressCountry: 'BR',
              },
              ...(config.whatsappNumber && { telephone: `+${config.whatsappNumber}` }),
              sameAs: [INSTAGRAM.url],
            }),
          }}
        />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <TopLoader />
        <Providers>{children}</Providers>
        {whatsappHref && <WhatsAppFloat href={whatsappHref} />}
      </body>
    </html>
  )
}

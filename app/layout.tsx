import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { TopLoader } from '@/components/TopLoader'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { getSiteContent, whatsappLink } from '@/lib/content'
import './globals.scss'

const heading = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading-var',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-var',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteContent()
  return { title: config.seoTitle, description: config.seoDescription }
}

const WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Web Dev Recife e quero saber mais.'

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
      className={`${heading.variable} ${body.variable}`}
    >
      <body className="font-body">
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

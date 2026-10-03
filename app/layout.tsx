import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { TopLoader } from '@/components/TopLoader'
import { getSiteContent } from '@/lib/content'
import './globals.scss'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne-var',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-var',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getSiteContent()
  return { title: config.seoTitle, description: config.seoDescription }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-dm`}>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <TopLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

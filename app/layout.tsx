import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Web Dev Recife — Seu negócio no digital',
  description:
    'Lojas online, cardápios digitais e apps de agendamento para negócios locais. Rápido de entregar, fácil de usar.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-dm`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

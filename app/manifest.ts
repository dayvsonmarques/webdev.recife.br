import type { MetadataRoute } from 'next'

/** Lets the site be added to the home screen with the brand name, colors and icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Web Dev Recife',
    short_name: 'Web Dev',
    description: 'Loja online, cardápio digital e agendamentos por assinatura.',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F6F3',
    theme_color: '#131313',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}

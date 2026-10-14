import type { Metadata } from 'next'
import { SITE_URL } from './site-url'

const SITE_NAME = 'Web Dev Recife'

type PageMetaInput = {
  title: string
  description: string
  /** Path from the site root, e.g. "/sobre". Use "/" for the home page. */
  path: string
}

/** Canonical + OpenGraph + Twitter card for a page, from just title/description/path. */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

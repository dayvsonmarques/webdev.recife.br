import type { Metadata } from 'next'
import { SITE_URL } from './site-url'

const SITE_NAME = 'Web Dev Recife'

type PageMetaInput = {
  title: string
  description: string
  /** Path from the site root, e.g. "/sobre". Use "/" for the home page. */
  path: string
  /** Preview image route; defaults to the site-wide app/opengraph-image. */
  image?: string
}

/** Canonical + OpenGraph + Twitter card for a page, from just title/description/path. */
export function pageMetadata({ title, description, path, image = '/opengraph-image' }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  // A page's own openGraph/twitter object replaces the parent's, file-based image included, so set it here.
  const images = [{ url: image, width: 1200, height: 630, alt: title }]
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
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

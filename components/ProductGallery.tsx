import Image from 'next/image'
import type { GalleryShot, ProductGallery as Gallery } from '@/lib/product-gallery'
import { LoopVideo } from './LoopVideo'

const frame = { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }

function ShotLink({ shot, sizes, phone }: { shot: GalleryShot; sizes: string; phone?: boolean }) {
  return (
    <a
      href={shot.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3"
    >
      <span
        className={`block overflow-hidden border transition-transform duration-200 group-hover:-translate-y-1 ${phone ? 'border-4' : ''}`}
        style={{ ...frame, borderRadius: phone ? '1.75rem' : 'var(--radius-md)' }}
      >
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} className="h-auto w-full" />
      </span>
      <span className="flex items-center justify-between gap-2 text-base">
        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{shot.label}</span>
        <span className="text-sm" style={{ color: 'var(--color-accent-text)' }}>
          Abrir loja ↗<span className="sr-only"> (abre em nova aba)</span>
        </span>
      </span>
    </a>
  )
}

/** "See it live" gallery on a product page: looping phone clip + desktop and mobile screenshots. */
export function ProductGallery({ gallery }: { gallery: Gallery }) {
  return (
    <section className="py-28" aria-labelledby="galeria-titulo">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p className="text-eyebrow font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-accent-text)' }}>
          Veja funcionando
        </p>
        <h2 id="galeria-titulo" className="font-heading text-heading font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {gallery.title}
        </h2>
        <p className="text-lead mb-14 max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
          {gallery.intro}
        </p>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:items-start">
          {gallery.video && (
            <figure className="mx-auto w-full max-w-[18rem]">
              <div className="overflow-hidden border-4" style={{ ...frame, borderRadius: '2rem' }}>
                <LoopVideo {...gallery.video} />
              </div>
              <figcaption className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {gallery.video.label}
              </figcaption>
            </figure>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            {gallery.desktop.map((shot) => (
              <ShotLink key={shot.src} shot={shot} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" />
            ))}
          </div>
        </div>

        {gallery.mobile.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-6 sm:max-w-md">
            {gallery.mobile.map((shot) => (
              <ShotLink key={shot.src} shot={shot} sizes="200px" phone />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

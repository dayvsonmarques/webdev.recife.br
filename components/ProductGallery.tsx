import Image from 'next/image'
import { cn } from '@/components/ui/cn'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { GalleryShot, ProductGallery as Gallery } from '@/lib/product-gallery'
import { LoopVideo } from './LoopVideo'

function ShotLink({ shot, sizes, phone }: { shot: GalleryShot; sizes: string; phone?: boolean }) {
  return (
    <a href={shot.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-4">
      <span
        className={cn(
          'block overflow-hidden border-line bg-surface shadow-card transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-lift',
          phone ? 'rounded-[1.75rem] border-4' : 'rounded-md border',
        )}
      >
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} className="h-auto w-full" />
      </span>
      <span className="flex items-center justify-between gap-2 text-base">
        <span className="font-medium text-ink">{shot.label}</span>
        <span className="text-sm text-gold-ink">
          Abrir loja ↗<span className="sr-only"> (abre em nova aba)</span>
        </span>
      </span>
    </a>
  )
}

/** "See it live" gallery on a product page: looping phone clip + desktop and mobile screenshots. */
export function ProductGallery({ gallery }: { gallery: Gallery }) {
  return (
    <Section aria-label={gallery.title}>
      <Container className="flex flex-col gap-16">
        <SectionHeader eyebrow="Veja funcionando" title={gallery.title} intro={gallery.intro} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:items-start">
          {gallery.video && (
            <figure className="mx-auto w-full max-w-[18rem]">
              <div className="overflow-hidden rounded-[2rem] border-4 border-line bg-surface shadow-lift">
                <LoopVideo {...gallery.video} />
              </div>
              <figcaption className="mt-3 text-sm text-muted">{gallery.video.label}</figcaption>
            </figure>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            {gallery.desktop.map((shot) => (
              <ShotLink key={shot.src} shot={shot} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" />
            ))}
          </div>
        </div>

        {gallery.mobile.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:max-w-md">
            {gallery.mobile.map((shot) => (
              <ShotLink key={shot.src} shot={shot} sizes="200px" phone />
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

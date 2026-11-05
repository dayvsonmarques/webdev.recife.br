import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { DemoStore, ProductGallery as Gallery } from '@/lib/product-gallery'

function StoreCard({ store }: { store: DemoStore }) {
  return (
    <a href={store.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-5">
      <span className="relative block aspect-[360/780] w-full max-w-[15rem] overflow-hidden rounded-[2rem] border-[6px] border-ink/90 bg-surface shadow-card transition-[transform,box-shadow] duration-300 group-hover:-translate-y-2 group-hover:shadow-lift">
        <Image src={store.image} alt={store.alt} fill sizes="(min-width: 1024px) 15rem, 45vw" className="object-cover object-top" />
      </span>
      <span className="flex flex-col items-center gap-1 text-center">
        <span className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold">{store.category}</span>
        <span className="font-heading text-lg font-bold text-ink">{store.name}</span>
        <span className="text-sm text-muted group-hover:text-accent-ink">
          Abrir loja ↗<span className="sr-only"> (abre em nova aba)</span>
        </span>
      </span>
    </a>
  )
}

/** Demo stores on a product page: one per business type, each opens the live store. */
export function ProductGallery({ gallery }: { gallery: Gallery }) {
  return (
    <Section aria-label={gallery.title}>
      <Container className="flex flex-col gap-16">
        <SectionHeader eyebrow="Veja funcionando" title={gallery.title} intro={gallery.intro} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {gallery.stores.map((store) => (
            <StoreCard key={store.href} store={store} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

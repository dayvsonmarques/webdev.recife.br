// Extras of a product page: demo stores (one per business type, phone screenshot in
// public/images/produtos) and a clip of the store's admin panel.

export interface DemoStore {
  category: string
  name: string
  href: string
  image: string
  alt: string
}

export interface ProductGallery {
  title: string
  intro: string
  stores: DemoStore[]
}

export interface PanelVideo {
  title: string
  intro: string
  mp4: string
  webm: string
  poster: string
  label: string
  highlights: string[]
}

const DIR = '/images/produtos/loja-online'
const store = (slug: string, category: string, name: string): DemoStore => ({
  category,
  name,
  href: `https://${slug}.webdev.recife.br`,
  image: `${DIR}/${slug}-navegacao.jpg`,
  alt: `Página inicial da loja de demonstração ${name} no celular`,
})

export const PRODUCT_GALLERIES: Record<string, ProductGallery> = {
  'loja-online': {
    title: 'Lojas de demonstração',
    intro: 'Abra no seu celular e navegue como se fosse cliente.',
    stores: [
      store('joias', 'Joias e relógios', 'Joias & Relógios'),
      store('eletronicos', 'Eletrônicos', 'Celulares & Acessórios'),
      store('moveis', 'Móveis', 'Móveis de Madeira'),
      store('bicicletaria', 'Bicicletas', 'Bicicletaria'),
    ],
  },
}

export const PANEL_VIDEOS: Record<string, PanelVideo> = {
  'loja-online': {
    title: 'Seu painel, simples de usar',
    intro: 'Tudo da loja num lugar só. Se você usa WhatsApp, consegue usar o painel.',
    mp4: `${DIR}/painel.mp4`,
    webm: `${DIR}/painel.webm`,
    poster: `${DIR}/painel.jpg`,
    label: 'Navegando pelo painel da loja: resumo de vendas, pedidos, produtos, cupons, clientes e vitrine',
    highlights: ['Vendas do mês num resumo', 'Pedidos com status', 'Produtos, preços e estoque', 'Cupons de desconto', 'Cadastro de clientes', 'Vitrine da página inicial'],
  },
}

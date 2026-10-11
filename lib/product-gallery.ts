// Screenshots of live demo stores per product page (static files in public/images/produtos).
// Captured from the production showcase stores of the cardapio app.

export interface GalleryShot {
  src: string
  alt: string
  label: string
  href: string
  width: number
  height: number
}

export interface ProductGallery {
  title: string
  intro: string
  video?: { mp4: string; webm: string; poster: string; label: string }
  desktop: GalleryShot[]
  mobile: GalleryShot[]
}

const DIR = '/images/produtos/loja-online'
const desktop = (file: string, label: string, alt: string, href: string): GalleryShot => ({
  src: `${DIR}/${file}`, alt, label, href, width: 960, height: 600,
})
const mobile = (file: string, label: string, alt: string, href: string): GalleryShot => ({
  src: `${DIR}/${file}`, alt, label, href, width: 390, height: 844,
})

export const PRODUCT_GALLERIES: Record<string, ProductGallery> = {
  'loja-online': {
    title: 'Lojas no ar',
    intro: 'Lojas-modelo feitas com a Loja Online. Clique em qualquer uma para navegar na loja de verdade.',
    video: {
      mp4: `${DIR}/joias-navegacao.mp4`,
      webm: `${DIR}/joias-navegacao.webm`,
      poster: `${DIR}/joias-navegacao.jpg`,
      label: 'Navegando pela loja de joias no celular: vitrine, destaques e página de produto',
    },
    desktop: [
      desktop('joias.webp', 'Joias & Relógios', 'Página inicial da loja Joias & Relógios, com banner e menu de categorias', 'https://joias.webdev.recife.br'),
      desktop('eletronicos.webp', 'Celulares & Acessórios', 'Página inicial da loja Celulares & Acessórios', 'https://eletronicos.webdev.recife.br'),
      desktop('moveis.webp', 'Móveis de Madeira', 'Página inicial da loja Móveis de Madeira', 'https://moveis.webdev.recife.br'),
      desktop('bicicletaria.webp', 'Bicicletaria', 'Página inicial da Bicicletaria', 'https://bicicletaria.webdev.recife.br'),
      desktop('joias-produto.webp', 'Página de produto', 'Página de produto com fotos, preço, variações de aro e banho e botão de compra', 'https://joias.webdev.recife.br'),
    ],
    mobile: [
      mobile('joias-mobile.webp', 'Vitrine no celular', 'Vitrine da loja de joias no celular', 'https://joias.webdev.recife.br'),
      mobile('joias-produto-mobile.webp', 'Produto no celular', 'Página de produto da loja de joias no celular', 'https://joias.webdev.recife.br'),
    ],
  },
}

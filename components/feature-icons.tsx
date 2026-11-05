import type { ReactNode } from 'react'

// Small line icons for product benefits and business types, picked by keyword so the
// texts can keep coming from the admin. Unknown text falls back to a check mark.

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const ICONS = {
  image: <Svg><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></Svg>,
  card: <Svg><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></Svg>,
  chat: <Svg><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" /></Svg>,
  tag: <Svg><path d="M20 12l-8 8-9-9V3h8l9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></Svg>,
  phone: <Svg><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></Svg>,
  ticket: <Svg><path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4V8z" /><path d="M10 9l4 6M10 15h.01M14 9h.01" /></Svg>,
  qr: <Svg><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" /></Svg>,
  calendar: <Svg><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>,
  bell: <Svg><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 003.4 0" /></Svg>,
  wifi: <Svg><path d="M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01" /></Svg>,
  check: <Svg><path d="M5 12l5 5L20 7" /></Svg>,
  shirt: <Svg><path d="M8 3l-5 3 2 5 3-1v11h8V10l3 1 2-5-5-3a4 4 0 01-8 0z" /></Svg>,
  shoe: <Svg><path d="M3 17V8l5 1 3 4 7 1a3 3 0 013 3H3zM3 17v2h18v-2" /></Svg>,
  gem: <Svg><path d="M6 3h12l3 6-9 12L3 9l3-6zM3 9h18M12 21L8 9l4-6 4 6-4 12" /></Svg>,
  watch: <Svg><circle cx="12" cy="12" r="6" /><path d="M12 9v3l2 1M9 6.5L10 2h4l1 4.5M9 17.5l1 4.5h4l1-4.5" /></Svg>,
  sofa: <Svg><path d="M4 11V8a3 3 0 013-3h10a3 3 0 013 3v3" /><path d="M2 13a2 2 0 014 0v2h12v-2a2 2 0 014 0v5H2v-5zM5 18v2M19 18v2" /></Svg>,
  bike: <Svg><circle cx="5.5" cy="16.5" r="3.5" /><circle cx="18.5" cy="16.5" r="3.5" /><path d="M5.5 16.5L9 9h6l3.5 7.5M9 9l3 7.5L15 9M8 6h3" /></Svg>,
  clock: <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>,
  pin: <Svg><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>,
  list: <Svg><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></Svg>,
  chart: <Svg><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Svg>,
  users: <Svg><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14a6 6 0 013.5 6" /></Svg>,
  unlock: <Svg><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 017.8-1.2" /></Svg>,
  spark: <Svg><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></Svg>,
  store: <Svg><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0 2.7 2.7 0 005.3 0M10 20v-5h4v5" /></Svg>,
} satisfies Record<string, ReactNode>

type IconId = keyof typeof ICONS

const RULES: [RegExp, IconId][] = [
  [/foto|catálogo|categoria/i, 'image'],
  [/pagamento|pix|cartão|checkout/i, 'card'],
  [/whatsapp|confirma/i, 'chat'],
  [/preço|estoque|disponibilidade/i, 'tag'],
  [/cupo|desconto|frete/i, 'ticket'],
  [/qr/i, 'qr'],
  [/agenda|horário|histórico|bloqueio/i, 'calendar'],
  [/lembrete|aviso|falta/i, 'bell'],
  [/internet/i, 'wifi'],
  [/celular/i, 'phone'],
  [/roupa/i, 'shirt'],
  [/calçado/i, 'shoe'],
  [/joia/i, 'gem'],
  [/relógio/i, 'watch'],
  [/eletrônico/i, 'phone'],
  [/móve/i, 'sofa'],
  [/bicicleta/i, 'bike'],
  [/24 horas|fechad/i, 'clock'],
  [/bairro|cidade/i, 'pin'],
  [/pedido/i, 'list'],
  [/vendas d|resumo|relatório/i, 'chart'],
  [/cliente|equipe/i, 'users'],
  [/fidelidade|cancele/i, 'unlock'],
  [/vitrine/i, 'store'],
]

export type { IconId }

/** Icon by id, for fixed texts written in the code. */
export const icon = (id: IconId) => ICONS[id]

/** Icon matching a benefit or business type, by keyword. */
export function iconFor(text: string, fallback: IconId = 'check') {
  return ICONS[RULES.find(([pattern]) => pattern.test(text))?.[1] ?? fallback]
}

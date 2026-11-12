import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Shared look of the link previews (WhatsApp, Instagram, Facebook, LinkedIn, X): dark card from the
// business card, gold wordmark, big title. Colors mirror styles/_tokens.scss (satori can't read CSS vars).
const C = { bg: '#131313', card: '#1B1B1D', line: '#2E2E31', ink: '#F4F3F0', muted: '#A3A3A8', gold: '#C9A961' }

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))

async function fonts() {
  const [regular, bold, logo] = await Promise.all([
    font('space-grotesk-latin-400-normal.woff'),
    font('space-grotesk-latin-700-normal.woff'),
    font('gemunu-libre-latin-700-normal.woff'),
  ])
  return [
    { name: 'Grotesk', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Grotesk', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Logo', data: logo, weight: 700 as const, style: 'normal' as const },
  ]
}

/** `< web dev />` wordmark, same strokes as components/Logo.tsx. */
export function Wordmark({ size }: { size: number }) {
  const h = size * 1.1
  const chevron = (flip: boolean) => (
    <svg width={h / 2} height={h} viewBox="0 0 12 24" fill="none" stroke={C.gold} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={flip ? 'M2 2l8 10-8 10' : 'M10 2L2 12l8 10'} />
    </svg>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.28, color: C.gold, fontFamily: 'Logo', fontSize: size, lineHeight: 1 }}>
      {chevron(false)}
      <span>web dev</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.12 }}>
        <svg width={h / 3} height={h} viewBox="0 0 8 24" fill="none" stroke={C.gold} strokeWidth="3" strokeLinecap="round">
          <path d="M6 2.5L2 21.5" />
        </svg>
        {chevron(true)}
      </div>
    </div>
  )
}

type OgCard = {
  /** Small gold label above the title, e.g. "Apps por assinatura". */
  eyebrow: string
  title: string
  subtitle?: string
  /** Short facts shown as pills at the bottom, e.g. ["7 dias grátis", "A partir de R$ 35/mês"]. */
  pills?: string[]
}

/** 1200×630 preview card. */
export async function ogImage({ eyebrow, title, subtitle, pills = [] }: OgCard) {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: C.bg, padding: 28, fontFamily: 'Grotesk' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 32,
            padding: '56px 64px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Wordmark size={44} />
            <span style={{ color: C.muted, fontSize: 26 }}>webdev.recife.br</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: C.gold, fontSize: 22, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase' }}>
              <div style={{ width: 40, height: 2, background: C.gold }} />
              {eyebrow}
            </div>
            <div style={{ color: C.ink, fontSize: title.length > 22 ? 76 : 100, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>{title}</div>
            {subtitle && <div style={{ color: C.muted, fontSize: 34, lineHeight: 1.3, maxWidth: 900 }}>{subtitle}</div>}
          </div>

          <div style={{ display: 'flex', gap: 14 }}>
            {pills.map((pill) => (
              <div key={pill} style={{ display: 'flex', color: C.ink, fontSize: 26, fontWeight: 700, border: `2px solid ${C.line}`, borderRadius: 999, padding: '12px 26px' }}>
                {pill}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  )
}

/** Square app icon (favicon PNG, home-screen icon): gold `</>` on the dark card. */
export function iconImage(px: number) {
  const s = px / 64
  return new ImageResponse(
    (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: C.bg }}>
        <svg width={44 * s} height={30 * s} viewBox="0 0 44 30" fill="none" stroke={C.gold} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3L3 15l9 12" />
          <path d="M26 3l-8 24" />
          <path d="M32 3l9 12-9 12" />
        </svg>
      </div>
    ),
    { width: px, height: px },
  )
}

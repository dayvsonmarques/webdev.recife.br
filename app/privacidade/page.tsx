import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSiteContent, whatsappLink } from '@/lib/content'
import { POLICY_VERSION, RETENTION_MONTHS } from '@/lib/quote-options'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Web Dev Recife',
  description: 'Como a Web Dev Studio trata os dados pessoais enviados pelo site, conforme a LGPD.',
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-subheading font-bold" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {children}
      </div>
    </section>
  )
}

const updatedAt = new Date(`${POLICY_VERSION}T12:00:00`).toLocaleDateString('pt-BR')

export default async function PrivacidadePage() {
  const { config } = await getSiteContent()
  const whatsapp = whatsappLink(config.whatsappNumber, 'Olá! Quero falar sobre meus dados pessoais (LGPD).')

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none pt-32 pb-28">
        <div className="max-w-3xl mx-auto px-6 md:px-8 flex flex-col gap-10">
          <div>
            <h1 className="font-heading text-heading font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Política de Privacidade
            </h1>
            <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
              Atualizada em {updatedAt}.
            </p>
          </div>

          <Block title="Quem cuida dos seus dados">
            <p>
              A Web Dev Studio, estúdio de desenvolvimento web em Recife (PE), é a controladora dos dados enviados por este site,
              nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </Block>

          <Block title="Quais dados coletamos">
            <p>
              Só os que você informa no formulário de orçamento: nome, WhatsApp, e-mail (opcional), nome e localização do
              negócio, e as respostas sobre o que você precisa. Não pedimos documentos, senhas nem dados de pagamento.
            </p>
          </Block>

          <Block title="Para que usamos">
            <p>
              Para analisar o seu pedido, preparar o orçamento e falar com você sobre ele. A base legal é o seu consentimento,
              dado ao marcar a caixa no formulário, e os procedimentos preliminares a um contrato que você solicitou.
            </p>
            <p>Não vendemos, não alugamos e não compartilhamos seus dados para publicidade.</p>
          </Block>

          <Block title="Onde ficam e por quanto tempo">
            <p>
              Os dados são enviados por conexão criptografada (HTTPS) e guardados no nosso sistema interno, acessível só por
              login. Se você não virar cliente, apagamos o pedido em até {RETENTION_MONTHS} meses. Se virar cliente, os dados de
              contato passam a fazer parte do seu cadastro enquanto durar a relação comercial.
            </p>
          </Block>

          <Block title="Seus direitos">
            <p>
              Você pode, a qualquer momento: confirmar se temos dados seus, pedir uma cópia, corrigir, pedir a exclusão ou retirar
              o consentimento. A exclusão é feita em até 15 dias.
            </p>
            <p>
              Para isso, fale com a gente
              {whatsapp ? (
                <>
                  {' '}
                  pelo{' '}
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="underline font-semibold" style={{ color: 'var(--color-accent-text)' }}>
                    WhatsApp
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </>
              ) : (
                ' pelos canais de contato do site'
              )}
              . Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </Block>

          <Block title="Cookies">
            <p>Este site não usa cookies de rastreamento nem de publicidade.</p>
          </Block>
        </div>
      </main>
      <Footer text={config.footerText} />
    </>
  )
}

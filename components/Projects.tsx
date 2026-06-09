'use client'

import { useInView } from '@/hooks/useInView'

const PROJECTS = [
  {
    segment: 'Restaurante',
    problem: 'Cardápio físico desatualizado e caro de reimprimir',
    solution: 'Cardápio digital com QR code, atualizável pelo celular',
    result: 'Redução de 80% em custos de reimpressão',
    mockupColor: 'rgba(245,158,11,0.18)',
    accentColor: '#f59e0b',
  },
  {
    segment: 'Salão de Beleza',
    problem: 'Agenda manual com alto índice de faltas',
    solution: 'App de agendamento com confirmação automática via WhatsApp',
    result: 'Redução de 40% em no-shows',
    mockupColor: 'rgba(236,72,153,0.18)',
    accentColor: '#ec4899',
  },
  {
    segment: 'Loja de Roupas',
    problem: 'Sem presença online, dependendo apenas do ponto físico',
    solution: 'Loja virtual integrada ao catálogo da loja',
    result: 'Crescimento de 30% em vendas no primeiro mês',
    mockupColor: 'rgba(99,102,241,0.18)',
    accentColor: '#6366f1',
  },
]

function BrowserMockup({ color, accent }: { color: string; accent: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden mb-6"
      style={{ border: '1px solid var(--color-border)' }}
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.6)' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(234,179,8,0.6)' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.6)' }} />
        <div
          className="flex-1 h-5 rounded-sm mx-1"
          style={{ backgroundColor: 'var(--color-border)' }}
        />
      </div>
      <div className="h-36 p-5" style={{ backgroundColor: color }}>
        <div className="h-3 rounded-sm w-1/2 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
        <div className="h-2 rounded-sm w-full mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
        <div className="h-2 rounded-sm w-4/5 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
        <div className="h-2 rounded-sm w-3/5 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
        <div className="h-7 w-20 rounded-md" style={{ backgroundColor: accent, opacity: 0.7 }} />
      </div>
    </div>
  )
}

function ProjectCard({
  segment,
  problem,
  solution,
  result,
  mockupColor,
  accentColor,
}: (typeof PROJECTS)[number]) {
  return (
    <div
      className="p-8 flex flex-col gap-5"
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <BrowserMockup color={mockupColor} accent={accentColor} />

      <span
        className="text-sm font-bold tracking-widest uppercase"
        style={{ color: 'var(--color-accent)' }}
      >
        {segment}
      </span>

      {[
        { label: 'Problema', value: problem, accent: false },
        { label: 'Solução', value: solution, accent: false },
        { label: 'Resultado', value: result, accent: true },
      ].map(({ label, value, accent }) => (
        <div key={label}>
          <p
            className="text-xs uppercase tracking-wide mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {label}
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

export function Projects() {
  const { ref, isInView } = useInView()

  return (
    <section
      id="projetos"
      ref={ref}
      className="py-28 transition-all duration-700"
      style={{
        backgroundColor: 'var(--color-surface)',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Cases reais
        </p>
        <h2
          className="font-syne text-4xl md:text-5xl font-bold mb-14"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Projetos
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.segment} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

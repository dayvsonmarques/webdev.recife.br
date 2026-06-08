'use client'

import { useInView } from '@/hooks/useInView'

const PROJECTS = [
  {
    segment: 'Restaurante',
    problem: 'Cardápio físico desatualizado e caro de reimprimir',
    solution: 'Cardápio digital com QR code, atualizável pelo celular',
    result: 'Redução de 80% em custos de reimpressão',
  },
  {
    segment: 'Salão de Beleza',
    problem: 'Agenda manual com alto índice de faltas',
    solution: 'App de agendamento com confirmação automática via WhatsApp',
    result: 'Redução de 40% em no-shows',
  },
  {
    segment: 'Loja de Roupas',
    problem: 'Sem presença online, dependendo apenas do ponto físico',
    solution: 'Loja virtual integrada ao catálogo da loja',
    result: 'Crescimento de 30% em vendas no primeiro mês',
  },
]

function ProjectCard({
  segment,
  problem,
  solution,
  result,
}: (typeof PROJECTS)[number]) {
  return (
    <div
      className="p-8 flex flex-col gap-6"
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <span
        className="text-xs font-bold tracking-widest uppercase"
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
            className="text-sm leading-relaxed"
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
      className="py-24 transition-all duration-700"
      style={{
        backgroundColor: 'var(--color-surface)',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Cases reais
        </p>
        <h2
          className="font-syne text-3xl md:text-4xl font-bold mb-12"
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

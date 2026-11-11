import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  icon: string
  children: ReactNode
  className?: string
}

export function Card({ title, icon, children, className = '' }: Props) {
  return (
    <section
      className={`fx-shine rounded-2xl border-2 border-line bg-panel p-6 shadow-lg shadow-shade transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-xl hover:shadow-accent/20 ${className}`}
    >
      <h2 className="fx-glow mb-6 flex items-center gap-3 border-b-2 border-line pb-4 text-2xl text-accent">
        <i className={`fas ${icon}`} />
        {title}
      </h2>
      {children}
    </section>
  )
}

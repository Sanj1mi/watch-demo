import type { StatValues } from '../model/types'

export function StatsGrid({ values }: { values: StatValues }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
      {Object.entries(values).map(([key, value]) => (
        <div
          key={key}
          className="rounded-xl border-2 border-line bg-panel px-4 py-3 shadow-sm shadow-shade transition hover:border-accent"
        >
          <span className="fx-glow block text-3xl font-extrabold text-accent">{value}</span>
          <span className="text-xs font-medium text-muted">{key}</span>
        </div>
      ))}
    </div>
  )
}

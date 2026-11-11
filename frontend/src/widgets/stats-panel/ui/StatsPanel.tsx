import { useEffect, useState } from 'react'
import { DetailedStats, StatsGrid, splitStats, statsApi } from '@/entities/stats'
import type { Statistics } from '@/entities/stats'
import { Button } from '@/shared/ui'

/** reloadKey: меняй значение снаружи, чтобы перезагрузить статистику */
export function StatsPanel({ reloadKey }: { reloadKey: number }) {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [detailed, setDetailed] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    statsApi.get().then((res) => {
      if (!cancelled && res.ok) setStats(res.body.data)
    })
    return () => {
      cancelled = true
    }
  }, [reloadKey, tick])

  const parts = stats ? splitStats(stats) : null

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-strong">
          <i className="fas fa-chart-bar text-accent" /> Статистика
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setDetailed((v) => !v)}>
            <i className={`fas ${detailed ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            {detailed ? 'Скрыть детали' : 'Детали'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            aria-label="Обновить статистику"
            onClick={() => setTick((t) => t + 1)}
          >
            <i className="fas fa-sync-alt" />
          </Button>
        </div>
      </div>

      {parts ? <StatsGrid values={parts.general} /> : <p className="text-muted">Загрузка статистики...</p>}

      {detailed && parts && (
        <div className="mt-4 rounded-2xl border-2 border-line bg-panel p-5">
          <DetailedStats departments={parts.departments} age={parts.age} />
        </div>
      )}
    </section>
  )
}

import { Empty } from '@/shared/ui'
import type { DeptStats, StatValues } from '../model/types'

interface Props {
  departments: Record<string, DeptStats>
  age: StatValues
}

const deptTitle = (dept: string) => (/^\d+$/.test(dept) ? `Отделение №${dept}` : dept)

export function DetailedStats({ departments, age }: Props) {
  const deptEntries = Object.entries(departments)
  const ageEntries = Object.entries(age)
  if (deptEntries.length === 0 && ageEntries.length === 0) {
    return <Empty>Нет данных для детальной статистики</Empty>
  }

  return (
    <>
      {deptEntries.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-soft">
            <i className="fas fa-hospital" /> Распределение по отделениям
          </h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {deptEntries.map(([dept, s]) => (
              <div
                key={dept}
                className="rounded-lg border border-line bg-field p-4 transition hover:-translate-y-1 hover:border-accent"
              >
                <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
                  <strong className="text-lg text-accent">{deptTitle(dept)}</strong>
                  <span className="rounded-full bg-linear-to-br from-accent to-accent-dark px-3 py-1 text-sm font-semibold text-white">
                    {s['Всего'] || 0} чел.
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      ['👨‍⚕️', s['Врачи'], 'Врачи'],
                      ['👩‍⚕️', s['Медсестры'], 'Медсестры'],
                      ['😷', s['Пациенты'], 'Пациенты'],
                    ] as const
                  ).map(([icon, count, label]) => (
                    <div key={label} className="flex items-center gap-3 rounded-md bg-field2 p-2">
                      <span className="w-8 text-center text-xl">{icon}</span>
                      <span className="min-w-8 text-lg font-bold text-accent">{count || 0}</span>
                      <span className="grow text-soft">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ageEntries.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-soft">
            <i className="fas fa-birthday-cake" /> Возрастная статистика
          </h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {ageEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-line bg-field p-3"
              >
                <span className="text-sm text-muted">{key}:</span>
                <span className="text-lg font-bold text-accent">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

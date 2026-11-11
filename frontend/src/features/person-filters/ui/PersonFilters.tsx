import type { PersonType } from '@/entities/person'
import { Pill, controlClass } from '@/shared/ui'

export type RoleFilter = PersonType | 'all'

const ROLES: Array<[RoleFilter, string]> = [
  ['all', 'Все'],
  ['doc', 'Врачи'],
  ['nurse', 'Медсестры'],
  ['patient', 'Пациенты'],
]

interface Props {
  search: string
  onSearchChange: (v: string) => void
  role: RoleFilter
  onRoleChange: (v: RoleFilter) => void
  maxAge: number
  onMaxAgeChange: (v: number) => void
  department: string
  onDepartmentChange: (v: string) => void
  departments: string[]
  onReset: () => void
}

export function PersonFilters(p: Props) {
  return (
    <div className="rounded-2xl border-2 border-line bg-panel p-4 shadow-md shadow-shade">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1.2fr]">
        <div className="relative">
          <i className="fas fa-search pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
          <input
            aria-label="Поиск по имени"
            className={`${controlClass} pl-11`}
            placeholder="Поиск по имени или фамилии"
            value={p.search}
            onChange={(e) => p.onSearchChange(e.target.value)}
          />
        </div>

        <select
          aria-label="Отделение"
          className={controlClass}
          value={p.department}
          onChange={(e) => p.onDepartmentChange(e.target.value)}
        >
          <option value="">Все отделения</option>
          {p.departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-3 rounded-xl border-2 border-line2 bg-field px-4 py-2 text-sm text-soft">
          <span className="whitespace-nowrap">
            Возраст до <b className="text-accent">{p.maxAge}</b>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={p.maxAge}
            className="w-full"
            onChange={(e) => p.onMaxAgeChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ROLES.map(([value, label]) => (
            <Pill key={value} active={p.role === value} onClick={() => p.onRoleChange(value)}>
              {label}
            </Pill>
          ))}
        </div>
        <button
          type="button"
          onClick={p.onReset}
          className="cursor-pointer text-sm font-medium text-muted transition hover:text-accent"
        >
          <i className="fas fa-times mr-1" /> Сбросить
        </button>
      </div>
    </div>
  )
}

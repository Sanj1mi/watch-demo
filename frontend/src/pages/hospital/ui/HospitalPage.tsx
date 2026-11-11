import { useState } from 'react'
import { AddPersonForm } from '@/features/add-person'
import { ClearAllButton } from '@/features/admin-actions'
import { PersonFilters } from '@/features/person-filters'
import { Button } from '@/shared/ui'
import { PersonsList } from '@/widgets/persons-list'
import { StatsPanel } from '@/widgets/stats-panel'
import { usePersons } from '../model/usePersons'

export function HospitalPage() {
  const p = usePersons()
  const [statsKey, setStatsKey] = useState(0)
  const [adding, setAdding] = useState(false)

  const changed = () => {
    void p.refresh()
    setStatsKey((k) => k + 1)
  }

  const handleReload = async () => {
    if (await p.reloadFromFile()) changed()
  }

  return (
    <main className="flex flex-col gap-6">
      <StatsPanel reloadKey={statsKey} />

      <PersonFilters
        search={p.search}
        onSearchChange={p.setSearch}
        role={p.role}
        onRoleChange={p.setRole}
        maxAge={p.maxAge}
        onMaxAgeChange={p.setMaxAge}
        department={p.department}
        onDepartmentChange={p.setDepartment}
        departments={p.departments}
        onReset={p.reset}
      />

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-strong">
            <i className="fas fa-users text-accent" /> Записи
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm text-accent">
              {p.persons.length}
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => p.sortBy('name')}>
              <i className="fas fa-sort-alpha-down" /> По имени
            </Button>
            <Button size="sm" variant="secondary" onClick={() => p.sortBy('department')}>
              <i className="fas fa-sort" /> По отделению
            </Button>
            <Button size="sm" variant="warning" onClick={handleReload}>
              <i className="fas fa-redo" /> Из файла
            </Button>
            <ClearAllButton onCleared={changed} />
            <Button size="sm" onClick={() => setAdding(true)}>
              <i className="fas fa-plus" /> Добавить
            </Button>
          </div>
        </div>

        <PersonsList persons={p.persons} onChanged={changed} />
      </section>

      {adding && <AddPersonForm onAdded={changed} onClose={() => setAdding(false)} />}
    </main>
  )
}

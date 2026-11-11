import { useCallback, useEffect, useMemo, useState } from 'react'
import { LogEntry, logApi } from '@/entities/log'
import type { HospitalizationLog } from '@/entities/log'
import { Button, Card, Empty, Field, Pill, controlClass, useToast } from '@/shared/ui'

type ActionFilter = 'all' | 'admission' | 'discharge'

const ACTIONS: Array<[ActionFilter, string]> = [
  ['all', 'Все'],
  ['admission', 'Госпитализации'],
  ['discharge', 'Выписки'],
]

export function Journal() {
  const toast = useToast()
  const [logs, setLogs] = useState<HospitalizationLog[]>([])
  const [action, setAction] = useState<ActionFilter>('all')
  const [patient, setPatient] = useState('')
  const [department, setDepartment] = useState('')

  const load = useCallback(async () => {
    const res = await logApi.getAll()
    if (res.ok) {
      const list = res.body.data ?? []
      setLogs(list)
      toast(`Загружено ${list.length} записей журнала`, 'success')
    }
    else toast('Ошибка загрузки журнала', 'error')
  }, [toast])

  useEffect(() => {
    void load()
  }, [load])

  const departments = useMemo(
    () => [...new Set(logs.map((l) => l.department).filter((d): d is string => !!d))].sort(),
    [logs],
  )

  const filtered = useMemo(() => {
    const term = patient.toLowerCase()
    return logs.filter(
      (l) =>
        (action === 'all' || l.action.toLowerCase() === action) &&
        (!department || l.department === department) &&
        (!term || (l.patientName ?? '').toLowerCase().includes(term)),
    )
  }, [logs, action, department, patient])

  return (
    <main>
      <Card title="Журнал госпитализаций" icon="fa-book-medical">
        <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 rounded-lg border border-line bg-field p-5">
          <Field label="Фильтры:">
            <div className="flex flex-wrap gap-3">
              {ACTIONS.map(([value, label]) => (
                <Pill key={value} active={action === value} onClick={() => setAction(value)}>
                  {label}
                </Pill>
              ))}
            </div>
          </Field>

          <Field label="Поиск пациента:" htmlFor="searchPatient">
            <input
              id="searchPatient"
              className={controlClass}
              placeholder="Имя пациента"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
            />
          </Field>

          <Field label="Отделение:" htmlFor="logDepartment">
            <select
              id="logDepartment"
              className={controlClass}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Все отделения</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          <div className="self-end pb-5">
            <Button variant="secondary" onClick={load}>
              <i className="fas fa-sync-alt" /> Обновить
            </Button>
          </div>
        </div>

        <div className="max-h-[600px] min-h-[500px] overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <Empty>Журнал пуст</Empty>
          ) : (
            filtered.map((l) => <LogEntry key={l.id} log={l} />)
          )}
        </div>
      </Card>
    </main>
  )
}

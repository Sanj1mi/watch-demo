import { useState } from 'react'
import type { FormEvent } from 'react'
import { PersonCard } from '@/entities/person'
import type { Person } from '@/entities/person'
import { Button, Card, Empty, controlClass } from '@/shared/ui'
import { query } from '@/shared/api'
import { jpaApi } from '../api/jpaApi'
import type { JpaQuery } from '../model/queries'

export function QueryCard({ q }: { q: JpaQuery }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(q.params.map((p) => [p.name, p.defaultValue])),
  )
  const [result, setResult] = useState<Person[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ms, setMs] = useState(0)

  const run = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const started = performance.now()
    const res = await jpaApi.run(q, values)
    setMs(Math.round(performance.now() - started))
    setLoading(false)
    if (!res.ok) {
      setResult(null)
      setError(res.error)
    } else if (!Array.isArray(res.data)) {
      setResult(null)
      setError('Сервер вернул не список')
    } else {
      setResult(res.data)
    }
  }

  const isHql = q.kind === 'HQL'

  return (
    <Card title={q.title} icon="fa-database">
      <span
        className={`mb-3 inline-block rounded-full border-2 px-3 py-0.5 text-xs font-bold tracking-widest uppercase ${
          isHql ? 'border-warn text-warn' : 'border-nurse text-nurse'
        }`}
      >
        {q.kind}
      </span>
      <p className="mb-4 text-soft">{q.description}</p>

      <pre className="mb-4 overflow-x-auto rounded-lg border border-line bg-field p-4 font-mono text-xs leading-relaxed text-soft">
        {q.code}
      </pre>

      <form onSubmit={run}>
        <div className="mb-3 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          {q.params.map((p) => (
            <div key={p.name}>
              <label
                htmlFor={`${q.id}-${p.name}`}
                className="mb-1 block text-xs font-semibold tracking-wide text-soft uppercase"
              >
                {p.label}
              </label>
              <input
                id={`${q.id}-${p.name}`}
                type={p.type}
                required
                placeholder={p.placeholder}
                className={controlClass}
                value={values[p.name]}
                onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <p className="mb-4 font-mono text-xs break-all text-dim">
          GET /api{q.endpoint}
          {query(values)}
        </p>

        <Button type="submit" disabled={loading}>
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-play'}`} /> Выполнить
        </Button>
      </form>

      {error && <p className="mt-4 font-semibold text-accent">✗ {error}</p>}

      {result && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-muted">
            Найдено: <span className="text-accent">{result.length}</span> · {ms} мс
          </p>
          {result.length === 0 ? (
            <Empty>Ничего не найдено</Empty>
          ) : (
            <div className="max-h-[480px] overflow-y-auto pr-2">
              {result.map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

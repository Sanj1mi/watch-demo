import { JPA_QUERIES, QueryCard } from '@/features/jpa-queries'

export function JpaPage() {
  return (
    <main>
      <p className="mb-6 rounded-xl border-2 border-dashed border-line bg-panel/60 p-4 text-soft">
        <i className="fas fa-circle-info mr-2 text-accent" />
        Демонстрация запросов из <code className="font-mono text-accent">PersonQueryService</code>:
        три Criteria API и один HQL. Каждая карточка вызывает свой эндпоинт{' '}
        <code className="font-mono text-accent">/api/jpa-queries/…</code>.
      </p>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        {JPA_QUERIES.map((q) => (
          <QueryCard key={q.id} q={q} />
        ))}
      </div>
    </main>
  )
}

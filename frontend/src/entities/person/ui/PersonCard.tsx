import type { ReactNode } from 'react'
import { copyText } from '@/shared/lib'
import { useToast } from '@/shared/ui'
import { getPersonType } from '../model/lib'
import type { Person, PersonType } from '../model/types'

const TYPE_INFO: Record<PersonType, { label: string; icon: string; badge: string }> = {
  doc: { label: 'Врач', icon: 'fa-user-md', badge: 'border-ok bg-ok/10 text-ok' },
  nurse: { label: 'Медсестра', icon: 'fa-user-nurse', badge: 'border-nurse bg-nurse/10 text-nurse' },
  patient: {
    label: 'Пациент',
    icon: 'fa-user-injured',
    badge: 'border-patient bg-patient/10 text-patient',
  },
}

function details(p: Person, type: PersonType): Array<[string, string]> {
  const salary: Array<[string, string]> = p.salary
    ? [['Зарплата', `$${Number(p.salary).toFixed(2)}`]]
    : []
  switch (type) {
    case 'doc':
      return [['Специализация', p.specialty || '-'], ['Лицензия', p.license || '-'], ...salary]
    case 'nurse':
      return [['Смена', p.shift || '-'], ['Квалификация', p.qualification || '-'], ...salary]
    case 'patient':
      return [['Диагноз', p.diagnosis || '-'], ['Страховка', p.insuranceNum || '-']]
  }
}

interface Props {
  person: Person
  /** слот для действий (кнопки внизу карточки) */
  actions?: ReactNode
}

export function PersonCard({ person, actions }: Props) {
  const toast = useToast()
  const type = getPersonType(person)
  const info = TYPE_INFO[type]
  const items: Array<[string, string]> = [
    ['Возраст', `${person.age} лет`],
    ['Отделение', person.department],
    ...details(person, type),
  ]

  return (
    <article className="flex h-full flex-col rounded-2xl border-2 border-line bg-panel p-5 shadow-md shadow-shade transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-accent/20">
      <div className="mb-4 flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-lg ${info.badge}`}
        >
          <i className={`fas ${info.icon}`} />
        </div>
        <div className="min-w-0 grow">
          <h3 className="truncate text-lg font-bold text-strong">
            {person.firstName} {person.lastName}
          </h3>
          <span
            className={`mt-0.5 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${info.badge}`}
          >
            {info.label}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        {items.map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg bg-field px-3 py-2">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="truncate font-semibold text-strong" title={value}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-4">
        {actions}
        <button
          type="button"
          title="Скопировать ID"
          onClick={async () =>
            toast((await copyText(person.id)) ? 'ID скопирован' : 'Не удалось скопировать', 'info')
          }
          className="mt-3 flex w-full cursor-pointer items-center justify-end gap-1.5 font-mono text-[11px] text-dim transition hover:text-accent"
        >
          <span className="truncate">ID: {person.id}</span>
          <i className="far fa-copy" />
        </button>
      </div>
    </article>
  )
}

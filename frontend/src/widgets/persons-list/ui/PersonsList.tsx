import { PersonCard, getPersonType } from '@/entities/person'
import type { Person } from '@/entities/person'
import { PersonAdminActions } from '@/features/admin-actions'
import { useAdmin } from '@/features/admin-auth'
import { PatientActions } from '@/features/patient-admission'
import { Empty } from '@/shared/ui'

interface Props {
  persons: Person[]
  onChanged: () => void
}

export function PersonsList({ persons, onChanged }: Props) {
  const { isAdmin } = useAdmin()

  if (persons.length === 0) {
    return <Empty>Ничего не найдено. Измените фильтры или добавьте запись.</Empty>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {persons.map((p) => {
        const isPatient = getPersonType(p) === 'patient'
        return (
          <PersonCard
            key={p.id}
            person={p}
            actions={
              isPatient || isAdmin ? (
                <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                  {isPatient && <PatientActions patient={p} />}
                  <PersonAdminActions person={p} onChanged={onChanged} />
                </div>
              ) : undefined
            }
          />
        )
      })}
    </div>
  )
}

import { useState } from 'react'
import { getPersonType, personApi } from '@/entities/person'
import type { Person } from '@/entities/person'
import { useAdmin } from '@/features/admin-auth'
import { Button, Field, Modal, controlClass, useToast } from '@/shared/ui'
import { adminActionsApi } from '../api/adminActionsApi'

/** Кнопки «Изменить» / «Удалить» прямо на карточке (только для админа) */
export function PersonAdminActions({ person, onChanged }: { person: Person; onChanged: () => void }) {
  const { isAdmin } = useAdmin()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [info, setInfo] = useState('')

  if (!isAdmin) return null

  const type = getPersonType(person)
  const label = type === 'doc' ? 'Новая специализация' : 'Новый диагноз'

  const save = async () => {
    const value = info.trim()
    if (!value) return toast('Введите новое значение', 'warning')
    const res = await personApi.editMedicalInfo(person.id, value)
    if (!res.ok) return toast(res.error, 'error')
    toast(res.body.message ?? 'Запись обновлена', 'success')
    setEditing(false)
    setInfo('')
    onChanged()
  }

  const remove = async () => {
    if (!confirm(`Удалить: ${person.firstName} ${person.lastName}?`)) return
    const res = await adminActionsApi.remove(person.id)
    if (!res.ok) {
      return toast(res.requiresAuth ? 'Требуется аутентификация администратора' : res.error, 'error')
    }
    toast(res.body.message ?? 'Запись удалена', 'success')
    onChanged()
  }

  return (
    <>
      {type !== 'nurse' && (
        <Button size="sm" variant="warning" onClick={() => setEditing(true)}>
          <i className="fas fa-edit" /> Изменить
        </Button>
      )}
      <Button size="sm" variant="danger" onClick={remove}>
        <i className="fas fa-trash" /> Удалить
      </Button>

      {editing && (
        <Modal title="Редактирование" icon="fa-edit" onClose={() => setEditing(false)}>
          <p className="mb-4 text-soft">
            {person.firstName} {person.lastName}
          </p>
          <Field label={label} htmlFor={`edit-${person.id}`}>
            <input
              id={`edit-${person.id}`}
              autoFocus
              className={controlClass}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
            />
          </Field>
          <Button onClick={save}>
            <i className="fas fa-check" /> Сохранить
          </Button>
        </Modal>
      )}
    </>
  )
}

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { personApi } from '@/entities/person'
import type { NewPerson, PersonType } from '@/entities/person'
import { Button, Field, Modal, controlClass, useToast } from '@/shared/ui'

interface FormState {
  firstName: string
  lastName: string
  age: string
  department: string
  diagnosis: string
  insuranceNum: string
  specialty: string
  license: string
  shift: string
  qualification: string
  salary: string
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  age: '',
  department: '',
  diagnosis: '',
  insuranceNum: '',
  specialty: '',
  license: '',
  shift: 'Дневная',
  qualification: '',
  salary: '',
}

const typeFieldsClass = 'my-5 rounded-lg border-l-[5px] border-accent bg-field p-5 shadow-inner shadow-black/50'

export function AddPersonForm({ onAdded, onClose }: { onAdded: () => void; onClose: () => void }) {
  const toast = useToast()
  const [type, setType] = useState<PersonType>('patient')
  const [form, setForm] = useState<FormState>(EMPTY)

  const bind = (key: keyof FormState) => ({
    id: key,
    value: form[key],
    className: controlClass,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    const base = {
      type,
      firstName: form.firstName,
      lastName: form.lastName,
      age: parseInt(form.age, 10),
      department: form.department,
    }
    const salary = form.salary ? parseFloat(form.salary) : null

    let data: NewPerson
    if (type === 'patient') {
      data = { ...base, diagnosis: form.diagnosis, insuranceNum: form.insuranceNum }
    } else if (type === 'doc') {
      data = { ...base, specialty: form.specialty, license: form.license, salary }
    } else {
      data = { ...base, shift: form.shift, qualification: form.qualification, salary }
    }

    const res = await personApi.add(data)
    if (!res.ok) return toast(res.error || 'Ошибка добавления', 'error')
    toast(res.body.message ?? 'Запись добавлена', 'success')
    setForm(EMPTY)
    onAdded()
    onClose()
  }

  return (
    <Modal title="Добавить запись" icon="fa-user-plus" onClose={onClose} wide>
      <form onSubmit={submit}>
        <Field label="Тип:" htmlFor="personType">
          <select
            id="personType"
            className={controlClass}
            value={type}
            onChange={(e) => setType(e.target.value as PersonType)}
          >
            <option value="patient">Пациент</option>
            <option value="doc">Врач</option>
            <option value="nurse">Медсестра</option>
          </select>
        </Field>

        <div className="grid gap-x-4 sm:grid-cols-2">
        <Field label="Имя:" htmlFor="firstName">
          <input type="text" required {...bind('firstName')} />
        </Field>
        <Field label="Фамилия:" htmlFor="lastName">
          <input type="text" required {...bind('lastName')} />
        </Field>
        <Field label="Возраст:" htmlFor="age">
          <input type="number" min={0} max={150} required {...bind('age')} />
        </Field>
        <Field label="Отделение:" htmlFor="department">
          <input type="text" required {...bind('department')} />
        </Field>
        </div>

        {type === 'patient' && (
          <div className={typeFieldsClass}>
            <Field label="Диагноз:" htmlFor="diagnosis">
              <input type="text" {...bind('diagnosis')} />
            </Field>
            <Field label="Номер страховки:" htmlFor="insuranceNum">
              <input type="text" {...bind('insuranceNum')} />
            </Field>
          </div>
        )}

        {type === 'doc' && (
          <div className={typeFieldsClass}>
            <Field label="Специализация:" htmlFor="specialty">
              <input type="text" {...bind('specialty')} />
            </Field>
            <Field label="Лицензия:" htmlFor="license">
              <input type="text" {...bind('license')} />
            </Field>
            <Field label="Зарплата ($):" htmlFor="salary">
              <input type="number" step="0.01" min={0} placeholder="0.00" {...bind('salary')} />
            </Field>
          </div>
        )}

        {type === 'nurse' && (
          <div className={typeFieldsClass}>
            <Field label="Смена:" htmlFor="shift">
              <select {...bind('shift')}>
                <option value="Дневная">Дневная</option>
                <option value="Ночная">Ночная</option>
                <option value="Сменная">Сменная</option>
              </select>
            </Field>
            <Field label="Квалификация:" htmlFor="qualification">
              <input type="text" {...bind('qualification')} />
            </Field>
            <Field label="Зарплата ($):" htmlFor="salary">
              <input type="number" step="0.01" min={0} placeholder="0.00" {...bind('salary')} />
            </Field>
          </div>
        )}

        <Button type="submit">
          <i className="fas fa-plus" /> Добавить
        </Button>
      </form>
    </Modal>
  )
}

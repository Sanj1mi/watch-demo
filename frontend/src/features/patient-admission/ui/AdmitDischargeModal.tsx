import { useState } from 'react'
import { logApi } from '@/entities/log'
import type { Person } from '@/entities/person'
import { Button, Field, Modal, controlClass, useToast } from '@/shared/ui'

export type AdmissionMode = 'admit' | 'discharge'

const TEXT = {
  admit: {
    title: 'Госпитализация пациента',
    icon: 'fa-hospital',
    doctor: 'Лечащий врач:',
    notes: 'Заметки о госпитализации...',
    confirm: 'Подтвердить госпитализацию',
    success: 'Пациент госпитализирован',
    error: 'Ошибка логирования госпитализации',
    variant: 'primary',
  },
  discharge: {
    title: 'Выписка пациента',
    icon: 'fa-home',
    doctor: 'Выписывающий врач:',
    notes: 'Заметки о выписке...',
    confirm: 'Подтвердить выписку',
    success: 'Пациент выписан',
    error: 'Ошибка логирования выписки',
    variant: 'danger',
  },
} as const

interface Props {
  patient: Person
  mode: AdmissionMode
  onClose: () => void
}

export function AdmitDischargeModal({ patient, mode, onClose }: Props) {
  const toast = useToast()
  const t = TEXT[mode]
  const [doctorName, setDoctorName] = useState('')
  const [notes, setNotes] = useState('')

  const confirm = async () => {
    const payload = {
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      department: patient.department,
      doctorName,
      notes,
    }
    const res =
      mode === 'admit'
        ? await logApi.admit({ ...payload, diagnosis: patient.diagnosis ?? '' })
        : await logApi.discharge(payload)

    if (res.ok) toast(t.success, 'success')
    else toast(t.error, 'error')
    onClose()
  }

  return (
    <Modal title={t.title} icon={t.icon} onClose={onClose}>
      <p className="mb-1">
        <strong>Пациент:</strong> {patient.firstName} {patient.lastName}
      </p>
      <p className="mb-5">
        <strong>Отделение:</strong> {patient.department}
      </p>

      <Field label={t.doctor} htmlFor="doctorName">
        <input
          id="doctorName"
          className={controlClass}
          placeholder="ФИО врача"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
      </Field>
      <Field label="Дополнительные заметки:" htmlFor="logNotes">
        <textarea
          id="logNotes"
          rows={3}
          className={controlClass}
          placeholder={t.notes}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      <Button variant={t.variant} onClick={confirm}>
        <i className="fas fa-check" /> {t.confirm}
      </Button>
    </Modal>
  )
}

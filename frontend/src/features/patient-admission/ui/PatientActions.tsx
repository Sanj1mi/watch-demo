import { useState } from 'react'
import type { Person } from '@/entities/person'
import { AdmitDischargeModal } from './AdmitDischargeModal'
import type { AdmissionMode } from './AdmitDischargeModal'

/** Только кнопки + модалка; контейнер задаёт родитель */
export function PatientActions({ patient }: { patient: Person }) {
  const [mode, setMode] = useState<AdmissionMode | null>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => setMode('admit')}
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-br from-ok to-ok/70 px-3.5 py-1.5 text-xs font-semibold text-on-ok transition hover:-translate-y-0.5"
      >
        <i className="fas fa-hospital" /> Госпитализировать
      </button>
      <button
        type="button"
        onClick={() => setMode('discharge')}
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-br from-accent to-accent-dark px-3.5 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5"
      >
        <i className="fas fa-home" /> Выписать
      </button>
      {mode && <AdmitDischargeModal patient={patient} mode={mode} onClose={() => setMode(null)} />}
    </>
  )
}

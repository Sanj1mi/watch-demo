import type { HospitalizationLog } from '../model/types'

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-field2 p-3">
      <div className="mb-1 text-xs tracking-wide text-muted uppercase">{label}</div>
      <div className="font-semibold text-strong">{value}</div>
    </div>
  )
}

export function LogEntry({ log }: { log: HospitalizationLog }) {
  const isAdmission = log.action === 'ADMISSION'
  const date = new Date(log.timestamp).toLocaleString('ru-RU')

  return (
    <div
      className={`mb-4 rounded-lg border border-l-[5px] border-line bg-field p-5 transition hover:translate-x-1 hover:shadow-lg hover:shadow-accent/20 ${
        isAdmission ? 'border-l-ok' : 'border-l-accent'
      }`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
        <div className="text-xl font-bold text-accent">
          <i className={`fas ${isAdmission ? 'fa-plus-circle' : 'fa-minus-circle'}`} />{' '}
          {log.patientName}
        </div>
        <div
          className={`rounded-full border-2 px-4 py-1 text-sm font-bold tracking-widest uppercase ${
            isAdmission ? 'border-ok bg-ok/20 text-ok' : 'border-accent bg-accent/20 text-accent'
          }`}
        >
          {isAdmission ? 'Госпитализация' : 'Выписка'}
        </div>
      </div>

      <div className="font-mono text-sm text-muted">
        <i className="far fa-clock" /> {date}
      </div>

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <Detail label="Отделение" value={log.department || '-'} />
        {isAdmission && <Detail label="Диагноз" value={log.diagnosis || '-'} />}
        <Detail label="Врач" value={log.doctorName || '-'} />
      </div>

      {log.notes && (
        <div className="mt-4 rounded-md border-l-[3px] border-accent bg-accent/5 p-4">
          <div className="mb-1 text-xs tracking-wide text-accent uppercase">Заметки</div>
          <div className="font-semibold text-strong">{log.notes}</div>
        </div>
      )}

      <div className="mt-4 text-right font-mono text-xs text-dim">ID пациента: {log.patientId}</div>
    </div>
  )
}

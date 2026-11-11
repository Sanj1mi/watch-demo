import { useEffect, useState } from 'react'
import { checkHealth } from '@/shared/api'

type Status = 'checking' | 'up' | 'down'

const LABEL: Record<Status, string> = { checking: 'проверка...', up: 'работает', down: 'ошибка' }
const STYLE: Record<Status, string> = {
  checking: '',
  up: 'border-ok bg-ok/10 text-ok',
  down: 'border-accent bg-accent/10 text-accent',
}

export function Footer() {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    checkHealth().then((r) => setStatus(r.ok ? 'up' : 'down'))
  }, [])

  return (
    <footer className="mt-5 rounded-xl border-2 border-line bg-panel p-5 text-center text-sm text-dim">
      Hospital Management System | Status:{' '}
      <span className={`ml-2 rounded-full border-2 border-transparent px-4 py-1 font-bold ${STYLE[status]}`}>
        {LABEL[status]}
      </span>
    </footer>
  )
}

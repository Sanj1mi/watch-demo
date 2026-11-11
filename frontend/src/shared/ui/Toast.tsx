import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type Notify = (text: string, type?: ToastType) => void

interface ToastItem {
  id: number
  text: string
  type: ToastType
}

const MAX_TOASTS = 4 // больше — самые старые вытесняются
const DURATION_MS = 3000

const icons: Record<ToastType, string> = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' }
const borders: Record<ToastType, string> = {
  success: 'border-ok',
  error: 'border-accent',
  warning: 'border-warn',
  info: 'border-line2',
}

const ToastContext = createContext<Notify>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback<Notify>(
    (text, type = 'info') => {
      const id = nextId.current++
      setItems((prev) =>
        // одинаковое сообщение заменяем новым, а не копим дубли
        [...prev.filter((t) => !(t.text === text && t.type === type)), { id, text, type }].slice(
          -MAX_TOASTS,
        ),
      )
      setTimeout(() => dismiss(id), DURATION_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-20 z-[60] flex flex-col gap-2 md:right-8 md:bottom-8"
      >
        {items.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`anim-toast pointer-events-auto max-w-sm min-w-64 cursor-pointer rounded-xl border-2 bg-panel px-5 py-3 text-sm shadow-xl shadow-shade ${borders[t.type]}`}
          >
            <strong>{icons[t.type]}</strong> {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

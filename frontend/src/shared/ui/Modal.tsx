import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  title: string
  icon: string
  onClose: () => void
  wide?: boolean
  children: ReactNode
}

export function Modal({ title, icon, onClose, wide = false, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Портал в body: иначе предок с backdrop-filter/transform (шапка, карточки)
  // становится «рамкой» для position: fixed и модалка рисуется внутри него
  return createPortal(
    <div
      className="anim-fade fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`anim-pop relative mx-auto my-8 w-full ${
          wide ? 'max-w-2xl' : 'max-w-md'
        } rounded-2xl border-2 border-accent bg-panel p-6 shadow-2xl shadow-accent/30 sm:p-8`}
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-accent hover:bg-accent/10"
        >
          &times;
        </button>
        <h2 className="mb-6 pr-8 text-xl font-bold text-accent sm:text-2xl">
          <i className={`fas ${icon}`} /> {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}

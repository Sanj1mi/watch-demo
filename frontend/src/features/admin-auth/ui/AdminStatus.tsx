import { useState } from 'react'
import { useAdmin } from '../model/AdminContext'
import { AdminLoginModal } from './AdminLoginModal'

const btn =
  'fx-sweep flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-br from-accent to-accent-dark px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-accent/30 transition hover:-translate-y-0.5'

export function AdminStatus() {
  const { isAdmin, logout } = useAdmin()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-3">
      {isAdmin ? (
        <>
          <span className="hidden rounded-full border-2 border-ok bg-ok/10 px-4 py-1.5 text-sm font-semibold text-ok sm:inline-block">
            <i className="fas fa-user-shield" /> Админ
          </span>
          <button type="button" className={btn} onClick={logout} aria-label="Выйти">
            <i className="fas fa-sign-out-alt" /> <span className="hidden sm:inline">Выйти</span>
          </button>
        </>
      ) : (
        <button type="button" className={btn} onClick={() => setOpen(true)} aria-label="Войти как админ">
          <i className="fas fa-sign-in-alt" /> <span className="hidden sm:inline">Войти</span>
        </button>
      )}
      {open && <AdminLoginModal onClose={() => setOpen(false)} />}
    </div>
  )
}

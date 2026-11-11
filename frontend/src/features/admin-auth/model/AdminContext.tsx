import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useToast } from '@/shared/ui'
import { adminApi } from '../api/adminApi'

interface AdminState {
  isAdmin: boolean
  login: (password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminState | null>(null)

/** Формат ответа /admin/status не зафиксирован — читаем терпимо */
function parseAdminStatus(payload: unknown): boolean {
  if (typeof payload === 'boolean') return payload
  if (payload && typeof payload === 'object') {
    const d = payload as Record<string, unknown>
    for (const key of ['isAdmin', 'admin', 'authenticated', 'loggedIn', 'authorized']) {
      if (typeof d[key] === 'boolean') return d[key] as boolean
    }
  }
  return false
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const toast = useToast()

  // сервер помнит сессию — при загрузке страницы спрашиваем, админ ли мы
  useEffect(() => {
    let cancelled = false
    adminApi.status().then((res) => {
      if (cancelled || !res.ok) return
      setIsAdmin(parseAdminStatus(res.body.data ?? res.body))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (password: string) => {
    const res = await adminApi.auth(password)
    if (res.ok) {
      setIsAdmin(true)
      return { ok: true as const }
    }
    const error =
      res.status === 401
        ? 'Неверный пароль'
        : res.status === 403
          ? 'Доступ запрещён (403): на сервере, вероятно, включён CSRF или нет прав'
          : res.error
    return { ok: false as const, error }
  }, [])

  const logout = useCallback(async () => {
    const res = await adminApi.logout()
    if (res.ok) {
      setIsAdmin(false)
      toast('Вы вышли из админ-режима', 'success')
    }
  }, [toast])

  return <AdminContext.Provider value={{ isAdmin, login, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminState {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}

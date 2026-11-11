import { request } from '@/shared/api'

export const adminApi = {
  auth: (password: string) => request('/admin/auth', 'POST', { password }),
  status: () => request<unknown>('/admin/status'),
  logout: () => request('/admin/logout', 'POST'),
}

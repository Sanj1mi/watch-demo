import { request } from '@/shared/api'

export const adminActionsApi = {
  remove: (id: string) => request(`/admin/delete/${id}`, 'DELETE'),
  clearAll: () => request('/admin/clear', 'DELETE'),
}

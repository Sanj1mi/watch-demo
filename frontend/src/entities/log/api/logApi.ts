import { request } from '@/shared/api'
import type { HospitalizationLog, LogPayload } from '../model/types'

export const logApi = {
  getAll: () => request<HospitalizationLog[]>('/logs/all'),
  admit: (data: LogPayload) => request('/logs/admission', 'POST', data),
  discharge: (data: LogPayload) => request('/logs/discharge', 'POST', data),
}

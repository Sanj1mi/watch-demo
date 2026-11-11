import { request } from '@/shared/api'
import type { Statistics } from '../model/types'

export const statsApi = {
  get: () => request<Statistics>('/hospital/statistics'),
}

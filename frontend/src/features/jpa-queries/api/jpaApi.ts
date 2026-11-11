import { query, requestRaw } from '@/shared/api'
import type { Person } from '@/entities/person'
import type { JpaQuery } from '../model/queries'

export const jpaApi = {
  run: (q: JpaQuery, values: Record<string, string>) =>
    requestRaw<Person[]>(`${q.endpoint}${query(values)}`),
}

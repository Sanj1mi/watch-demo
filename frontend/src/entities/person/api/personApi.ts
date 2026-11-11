import { query, request } from '@/shared/api'
import type { NewPerson, Person, PersonFilter } from '../model/types'

export const personApi = {
  getAll: () => request<Person[]>('/hospital/persons'),
  add: (person: NewPerson) => request<Person>('/hospital/add', 'POST', person),
  search: (name: string) => request<Person[]>(`/hospital/search${query({ name })}`),
  filter: (f: PersonFilter) => request<Person[]>(`/hospital/filter/multiple${query({ ...f })}`),
  sortByName: () => request<Person[]>('/hospital/sort/name'),
  sortByDepartment: () => request<Person[]>('/hospital/sort/department'),
  editMedicalInfo: (id: string, newInfo: string) =>
    request(`/hospital/edit/${id}${query({ newInfo })}`, 'PUT'),
  reload: () => request('/hospital/reload', 'POST'),
}

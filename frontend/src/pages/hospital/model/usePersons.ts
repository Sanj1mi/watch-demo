import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { personApi } from '@/entities/person'
import type { Person, PersonFilter } from '@/entities/person'
import type { RoleFilter } from '@/features/person-filters'
import { useToast } from '@/shared/ui'

export const DEFAULT_MAX_AGE = 100

export function usePersons() {
  const toast = useToast()
  const [persons, setPersons] = useState<Person[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [role, setRole] = useState<RoleFilter>('all')
  const [maxAge, setMaxAge] = useState(DEFAULT_MAX_AGE)
  const [department, setDepartment] = useState('')
  const [search, setSearch] = useState('')
  const requestId = useRef(0) // отбрасываем устаревшие ответы (слайдер возраста шлёт много запросов)

  const refresh = useCallback(async () => {
    const id = ++requestId.current
    const filter: PersonFilter = {}
    if (role !== 'all') filter.role = role
    if (maxAge < DEFAULT_MAX_AGE) {
      filter.minAge = 0
      filter.maxAge = maxAge
    }
    if (department) filter.department = department
    const filtered = Object.keys(filter).length > 0

    const res = filtered ? await personApi.filter(filter) : await personApi.getAll()
    if (id !== requestId.current) return
    if (!res.ok) return toast(res.error || 'Ошибка загрузки', 'error')

    const list = res.body.data ?? []
    setPersons(list)
    toast(
      filtered ? `Найдено ${list.length} записей по заданным фильтрам` : `Загружено ${list.length} записей`,
      'success',
    )
    // список отделений обновляем только по полной выборке, иначе он схлопнется до выбранного
    if (!filtered) {
      setDepartments([...new Set(list.map((p) => p.department).filter(Boolean))].sort())
    }
  }, [role, maxAge, department, toast])

  // небольшая задержка: ползунок возраста не засыпает сервер запросами
  useEffect(() => {
    const t = setTimeout(() => void refresh(), 200)
    return () => clearTimeout(t)
  }, [refresh])

  // поиск по имени — мгновенно, на клиенте
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return persons
    return persons.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(term))
  }, [persons, search])

  const sortBy = async (by: 'name' | 'department') => {
    const res = await (by === 'name' ? personApi.sortByName() : personApi.sortByDepartment())
    if (!res.ok) return toast('Ошибка сортировки', 'error')
    requestId.current++
    setPersons(res.body.data ?? [])
    toast(`Отсортировано по ${by === 'name' ? 'имени' : 'отделению'}`, 'success')
  }

  const reset = () => {
    const alreadyDefault = role === 'all' && maxAge === DEFAULT_MAX_AGE && !department
    setRole('all')
    setMaxAge(DEFAULT_MAX_AGE)
    setDepartment('')
    setSearch('')
    if (alreadyDefault) void refresh() // эффект не сработает — грузим вручную
  }

  /** Перезагрузка данных из hospital_storage.json на сервере */
  const reloadFromFile = async (): Promise<boolean> => {
    if (!confirm('Перезагрузить данные из файла? Текущие изменения будут потеряны.')) return false
    const res = await personApi.reload()
    if (!res.ok) {
      toast('Ошибка перезагрузки', 'error')
      return false
    }
    toast(res.body.message ?? 'Данные перезагружены', 'success')
    return true
  }

  return {
    persons: visible,
    departments,
    role,
    setRole,
    maxAge,
    setMaxAge,
    department,
    setDepartment,
    search,
    setSearch,
    refresh,
    sortBy,
    reset,
    reloadFromFile,
  }
}

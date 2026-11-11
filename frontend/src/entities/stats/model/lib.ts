import type { DeptStats, StatValues, Statistics } from './types'

export function splitStats(stats: Statistics): {
  general: StatValues
  departments: Record<string, DeptStats>
  age: StatValues
} {
  // старый плоский формат: { ключ: число }
  const flat: StatValues = Object.fromEntries(
    Object.entries(stats).filter(
      (e): e is [string, number | string] => typeof e[1] === 'number' || typeof e[1] === 'string',
    ),
  )
  return {
    general: stats['Общая'] ?? flat,
    departments: stats['По отделениям'] ?? {},
    age: stats['Возрастная статистика'] ?? {},
  }
}

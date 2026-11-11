export type StatValues = Record<string, number | string>

export interface DeptStats {
  'Всего'?: number
  'Врачи'?: number
  'Медсестры'?: number
  'Пациенты'?: number
}

export interface Statistics {
  'Общая'?: StatValues
  'По отделениям'?: Record<string, DeptStats>
  'Возрастная статистика'?: StatValues
  [key: string]: unknown
}

const API_BASE = '/api'

export interface ApiBody<T> {
  data: T
  message?: string
}

export type ApiResult<T> =
  | { ok: true; body: ApiBody<T> }
  | { ok: false; error: string; status?: number; requiresAuth?: boolean }

/** Для эндпоинтов, которые отдают JSON без обёртки { data, message } */
export type RawResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number }

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

class HttpError extends Error {
  status: number
  constructor(status: number) {
    super(`HTTP error! status: ${status}`)
    this.status = status
  }
}

const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Ошибка подключения к серверу')
const errorStatus = (e: unknown) => (e instanceof HttpError ? e.status : undefined)

async function send(endpoint: string, method: Method, data?: unknown): Promise<unknown> {
  const res = await fetch(API_BASE + endpoint, {
    method,
    credentials: 'same-origin', // сессионная кука админа
    headers: {
      'Content-Type': 'application/json',
      // Spring Security для таких запросов отвечает 401 БЕЗ WWW-Authenticate,
      // поэтому браузер не показывает своё нативное окно Basic-авторизации
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: data !== undefined && method !== 'GET' ? JSON.stringify(data) : undefined,
  })
  if (!res.ok) throw new HttpError(res.status)
  return res.json()
}

export async function request<T = unknown>(
  endpoint: string,
  method: Method = 'GET',
  data?: unknown,
): Promise<ApiResult<T>> {
  try {
    const body = (await send(endpoint, method, data)) as ApiBody<T>
    if (body.message?.includes('Требуется аутентификация')) {
      return { ok: false, error: body.message, requiresAuth: true }
    }
    return { ok: true, body }
  } catch (e) {
    return { ok: false, error: errorText(e), status: errorStatus(e) }
  }
}

export async function requestRaw<T = unknown>(endpoint: string): Promise<RawResult<T>> {
  try {
    return { ok: true, data: (await send(endpoint, 'GET')) as T }
  } catch (e) {
    return { ok: false, error: errorText(e), status: errorStatus(e) }
  }
}

/** { a: 1, b: undefined } -> "?a=1" */
export function query(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

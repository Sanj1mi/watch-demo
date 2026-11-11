import { request } from './http'

export const checkHealth = () => request('/health')

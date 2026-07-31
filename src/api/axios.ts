import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from './config'
import { clearStoredToken, getStoredToken } from './authToken'
import { extractApiErrorMessage } from './apiError'
import { ROUTES } from '../routes/routes.constants'

const HTTP_UNAUTHORIZED = 401

/** The success envelope every non-204 backend response is wrapped in. */
interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
}

const instance = axios.create({ baseURL: API_CONFIG.baseUrl })

/** Request interceptor: attaches the bearer token when the user is signed in. */
function attachAuth(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

/** Error interceptor: clears auth and redirects on 401, then normalizes the error. */
function handleError(error: unknown): Promise<never> {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined
  if (status === HTTP_UNAUTHORIZED) {
    clearStoredToken()
    if (window.location.pathname !== ROUTES.LOGIN) {
      window.location.assign(ROUTES.LOGIN)
    }
  }
  return Promise.reject(new Error(extractApiErrorMessage(error)))
}

instance.interceptors.request.use(attachAuth)
instance.interceptors.response.use(undefined, handleError)

/** Unwraps a response envelope to its inner `data` payload. */
async function unwrap<T>(promise: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> {
  const response = await promise
  return response.data?.data
}

/** Typed HTTP client whose methods resolve directly to the unwrapped payload. */
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.get<ApiEnvelope<T>>(url, config)),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.post<ApiEnvelope<T>>(url, data, config)),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.patch<ApiEnvelope<T>>(url, data, config)),
  delete: <T = void>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.delete<ApiEnvelope<T>>(url, config)),
}

import { AxiosError } from 'axios'

/** Fallback shown when the server provides no usable error message. */
export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.'

/** Error envelope shape returned by the backend: `{ success: false, message }`. */
interface ApiErrorBody {
  message?: string
}

/**
 * Extracts a human-readable message from an unknown error, preferring the
 * backend's `{ success: false, message }` envelope and falling back to a
 * generic message. Used by the axios error interceptor and thunk error handling.
 */
export function extractApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) {
      return body.message
    }
    if (error.message) {
      return error.message
    }
  }
  return GENERIC_ERROR_MESSAGE
}

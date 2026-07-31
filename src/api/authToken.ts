// Small localStorage-backed holder for the JWT access token. Kept separate from
// the Redux store so the axios interceptors can read/clear it without importing
// the store (which would create a circular dependency).

const TOKEN_STORAGE_KEY = 'rag.accessToken'

/** Returns the persisted access token, or null if the user is not signed in. */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

/** Persists the access token for subsequent authenticated requests. */
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

/** Clears the persisted access token (on logout or a 401). */
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

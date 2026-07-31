// Runtime configuration sourced from Vite env vars. This is the ONLY module in
// the app that reads import.meta.env (Rule 4) — everything else imports from here.
const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1'

/** Application runtime configuration. */
export const API_CONFIG = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    DEFAULT_API_BASE_URL,
} as const

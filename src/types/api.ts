// Shared types mirroring the backend API contract
// (see backend BACKEND_DEVELOPMENT_PLAN.md §8 — the authoritative source).

/** Processing state of an uploaded document. */
export type DocStatus = 'PROCESSING' | 'READY' | 'FAILED'

/** The response-safe user shape (never includes a password). */
export interface AuthUser {
  id: string
  email: string
  name?: string | null
}

/** Result of a successful signup or login. */
export interface AuthResult {
  user: AuthUser
  accessToken: string
}

/** An uploaded document and its ingestion status. */
export interface Document {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  status: DocStatus
  error?: string
  createdAt: string
}

/** A retrieved chunk citation returned alongside a chat answer. */
export interface Source {
  documentId: string
  filename: string
  chunkIndex: number
  snippet: string
}

/** A single message within a chat conversation. */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  createdAt: string
}

/** A chat conversation, optionally with its messages loaded. */
export interface Chat {
  id: string
  title?: string
  messages?: ChatMessage[]
  createdAt: string
}

/** Ephemeral realtime session details returned by the backend for a voice call. */
export interface RealtimeSession {
  value: string
  expiresAt: number
  model: string
  callsUrl: string
}

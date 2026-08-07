import { http } from './axios'
import type { RealtimeSession, Source } from '../types/api'

/** Fetches a short-lived ephemeral session for starting a WebRTC voice call. */
export function fetchRealtimeToken(): Promise<RealtimeSession> {
  return http.post<RealtimeSession>('/realtime/token')
}

/** Retrieves document chunks relevant to a query, for the `retrieve_documents` tool. */
export function retrieveDocuments(query: string): Promise<{ chunks: Source[] }> {
  return http.post('/realtime/retrieve', { query })
}

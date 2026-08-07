import { http } from './axios'
import type { Document } from '../types/api'

/** Uploads a file for ingestion; the server returns the created document. */
export function uploadDocument(file: File): Promise<Document> {
  const form = new FormData()
  form.append('file', file)
  return http.post<Document>('/documents', form)
}

/** Lists the current user's documents. */
export function listDocuments(): Promise<Document[]> {
  return http.get<Document[]>('/documents')
}

/** Deletes a document by id. */
export function deleteDocument(id: string): Promise<void> {
  return http.delete(`/documents/${id}`)
}

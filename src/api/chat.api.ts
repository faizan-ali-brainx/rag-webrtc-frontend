import { http } from './axios'
import type { Chat, Source } from '../types/api'

/** Payload for sending a chat message. */
export interface SendMessagePayload {
  message: string
  chatId?: string
}

/** Result of sending a chat message. */
export interface SendMessageResponse {
  chatId: string
  answer: string
  sources: Source[]
}

/** Sends a message and returns a grounded answer with sources. */
export function sendMessage(
  payload: SendMessagePayload,
): Promise<SendMessageResponse> {
  return http.post<SendMessageResponse>('/chat', payload)
}

/** Lists the current user's chats. */
export function listChats(): Promise<Chat[]> {
  return http.get<Chat[]>('/chat')
}

/** Loads a chat with its messages. */
export function getChat(id: string): Promise<Chat> {
  return http.get<Chat>(`/chat/${id}`)
}

/** Renames a chat and returns the updated summary. */
export function renameChat(id: string, title: string): Promise<Chat> {
  return http.patch<Chat>(`/chat/${id}`, { title })
}

/** Deletes a chat. */
export function deleteChat(id: string): Promise<void> {
  return http.delete(`/chat/${id}`)
}

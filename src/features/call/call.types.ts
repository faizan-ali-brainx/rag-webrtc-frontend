/** Live handles for an in-progress WebRTC call, so they can be torn down later. */
export interface CallConnection {
  pc: RTCPeerConnection
  mic: MediaStream
  dataChannel: RTCDataChannel
  audio: HTMLAudioElement
}

/** A single line of the on-screen call transcript. */
export interface TranscriptEntry {
  id: string
  role: 'user' | 'assistant'
  text: string
}

/** A data-channel message parsed into the shapes this feature cares about. */
export type ParsedRealtimeEvent =
  | { kind: 'transcript'; itemId: string; text: string }
  | { kind: 'toolCall'; callId: string; query: string }
  | { kind: 'ignored' }

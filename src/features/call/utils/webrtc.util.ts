import { OAI_EVENTS_CHANNEL, REALTIME_CONNECT_FAILED } from '../call.constants'
import type { CallConnection } from '../call.types'

/** Builds the `<audio>` element that plays the model's remote voice track. */
function createRemoteAudioSink(pc: RTCPeerConnection): HTMLAudioElement {
  const audio = new Audio()
  audio.autoplay = true
  pc.ontrack = (event) => {
    audio.srcObject = event.streams[0] ?? null
  }
  return audio
}

/**
 * Builds a peer connection, requests the microphone, and opens the events
 * data channel. Only ever call this from an explicit user action ("Start
 * call") — never on mount — since it triggers the mic permission prompt.
 */
export async function createPeerConnection(): Promise<CallConnection> {
  const pc = new RTCPeerConnection()
  const audio = createRemoteAudioSink(pc)
  const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
  mic.getTracks().forEach((track) => pc.addTrack(track, mic))
  const dataChannel = pc.createDataChannel(OAI_EVENTS_CHANNEL)
  return { pc, mic, dataChannel, audio }
}

/**
 * Negotiates the SDP offer/answer with OpenAI's Realtime endpoint. This
 * deliberately bypasses `api/axios.ts`: the body is a raw SDP string (not
 * JSON), auth is the short-lived ephemeral token (not our app's JWT), and the
 * response is plain SDP text, not our backend's `{ success, data }` envelope.
 */
export async function negotiateSdp(
  pc: RTCPeerConnection,
  token: string,
  callsUrl: string,
): Promise<void> {
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  const response = await fetch(callsUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/sdp',
    },
    body: offer.sdp,
  })
  if (!response.ok) {
    throw new Error(REALTIME_CONNECT_FAILED)
  }
  const answerSdp = await response.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
}

/** Releases every resource held by a call connection. Safe to call repeatedly. */
export function teardownCall(connection: CallConnection | null): void {
  if (!connection) return
  connection.dataChannel.close()
  connection.mic.getTracks().forEach((track) => track.stop())
  connection.pc.close()
  connection.audio.srcObject = null
}

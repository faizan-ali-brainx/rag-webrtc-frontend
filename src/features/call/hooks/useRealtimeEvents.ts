import { retrieveDocuments } from '../../../api/realtime.api'
import { sendToolResult, parseRealtimeEvent } from '../utils/toolBridge.util'
import {
  appendTranscript,
  lookupFinished,
  lookupStarted,
} from '../callSlice'
import type { AppDispatch } from '../../../app/store'

/** Looks up relevant chunks for the model's query and sends the tool result back. */
async function handleToolCall(
  dispatch: AppDispatch,
  dataChannel: RTCDataChannel,
  callId: string,
  query: string,
) {
  dispatch(lookupStarted())
  const { chunks } = await retrieveDocuments(query)
  sendToolResult(dataChannel, callId, chunks)
  dispatch(lookupFinished())
}

/**
 * Wires `dataChannel.onmessage` to route parsed realtime events: assistant
 * transcript chunks go to the store, tool calls trigger a retrieval round trip.
 */
export function attachRealtimeEvents(
  dataChannel: RTCDataChannel,
  dispatch: AppDispatch,
): void {
  dataChannel.onmessage = (event: MessageEvent<string>) => {
    const parsed = parseRealtimeEvent(event.data)
    if (parsed.kind === 'transcript') {
      dispatch(appendTranscript({ itemId: parsed.itemId, text: parsed.text }))
    } else if (parsed.kind === 'toolCall') {
      void handleToolCall(dispatch, dataChannel, parsed.callId, parsed.query)
    }
  }
}

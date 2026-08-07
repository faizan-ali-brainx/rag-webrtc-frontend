import {
  EVT_ASSISTANT_TRANSCRIPT_DELTA,
  EVT_CONVERSATION_ITEM_CREATE,
  EVT_FUNCTION_CALL_ARGUMENTS_DONE,
  EVT_RESPONSE_CREATE,
  ITEM_TYPE_FUNCTION_CALL_OUTPUT,
} from '../call.constants'
import type { ParsedRealtimeEvent } from '../call.types'
import type { Source } from '../../../types/api'

/** Shape of a raw data-channel message, narrowed just enough to route it. */
interface RawRealtimeEvent {
  type?: string
  delta?: string
  item_id?: string
  call_id?: string
  arguments?: string
}

function parseToolCall(raw: RawRealtimeEvent): ParsedRealtimeEvent {
  if (!raw.call_id) return { kind: 'ignored' }
  const args = JSON.parse(raw.arguments ?? '{}') as { query?: string }
  return { kind: 'toolCall', callId: raw.call_id, query: args.query ?? '' }
}

/** Parses a raw `oai-events` data-channel message into a typed union. */
export function parseRealtimeEvent(raw: string): ParsedRealtimeEvent {
  const event = JSON.parse(raw) as RawRealtimeEvent
  if (event.type === EVT_ASSISTANT_TRANSCRIPT_DELTA) {
    return { kind: 'transcript', itemId: event.item_id ?? '', text: event.delta ?? '' }
  }
  if (event.type === EVT_FUNCTION_CALL_ARGUMENTS_DONE) {
    return parseToolCall(event)
  }
  return { kind: 'ignored' }
}

/** Sends a tool's result back to the model, then asks it to continue speaking. */
export function sendToolResult(
  dataChannel: RTCDataChannel,
  callId: string,
  chunks: Source[],
): void {
  dataChannel.send(
    JSON.stringify({
      type: EVT_CONVERSATION_ITEM_CREATE,
      item: {
        type: ITEM_TYPE_FUNCTION_CALL_OUTPUT,
        call_id: callId,
        output: JSON.stringify({ chunks }),
      },
    }),
  )
  dataChannel.send(JSON.stringify({ type: EVT_RESPONSE_CREATE }))
}

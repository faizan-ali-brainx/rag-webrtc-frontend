// Event-type strings verified against OpenAI's Realtime API "client and server
// events" reference (developers.openai.com/api/reference/resources/realtime),
// checked at implementation time for a WebRTC session on gpt-realtime-2.1.

/** Name of the WebRTC data channel used to exchange realtime events. */
export const OAI_EVENTS_CHANNEL = 'oai-events'

/** Server event: incremental chunk of the assistant's spoken-response transcript. */
export const EVT_ASSISTANT_TRANSCRIPT_DELTA = 'response.output_audio_transcript.delta'

/** Server event: assistant spoken-response transcript has finished streaming. */
export const EVT_ASSISTANT_TRANSCRIPT_DONE = 'response.output_audio_transcript.done'

/**
 * Server event: transcript of the user's own speech, only emitted when the
 * session is configured with `input_audio_transcription` enabled.
 */
export const EVT_USER_TRANSCRIPT_COMPLETED =
  'conversation.item.input_audio_transcription.completed'

/** Server event: the model has finished emitting a tool call's arguments. */
export const EVT_FUNCTION_CALL_ARGUMENTS_DONE = 'response.function_call_arguments.done'

/** Client event: adds an item (e.g. a tool result) to the conversation. */
export const EVT_CONVERSATION_ITEM_CREATE = 'conversation.item.create'

/** Item type used when returning a tool's result via `conversation.item.create`. */
export const ITEM_TYPE_FUNCTION_CALL_OUTPUT = 'function_call_output'

/** Client event: asks the model to produce a response (e.g. after a tool result). */
export const EVT_RESPONSE_CREATE = 'response.create'

/** Name of the retrieval tool the model can call; must match the backend exactly. */
export const RETRIEVE_DOCUMENTS_TOOL_NAME = 'retrieve_documents'

/** User-facing error message shown when the WebRTC call fails to connect. */
export const REALTIME_CONNECT_FAILED = 'Could not connect the call. Please try again.'

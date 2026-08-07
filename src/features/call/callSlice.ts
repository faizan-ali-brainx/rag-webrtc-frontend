import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TranscriptEntry } from './call.types'

/** A streamed chunk of an assistant transcript, keyed by its response item id. */
interface TranscriptDelta {
  itemId: string
  text: string
}

type CallStatus = 'idle' | 'connecting' | 'live' | 'error'

interface CallState {
  status: CallStatus
  transcript: TranscriptEntry[]
  isLookingUp: boolean
  error: string | null
}

const initialState: CallState = {
  status: 'idle',
  transcript: [],
  isLookingUp: false,
  error: null,
}

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    callConnecting: (state) => {
      state.status = 'connecting'
      state.error = null
      state.transcript = []
    },
    callLive: (state) => {
      state.status = 'live'
    },
    callEnded: (state) => {
      state.status = 'idle'
      state.isLookingUp = false
    },
    callErrored: (state, action: PayloadAction<string>) => {
      state.status = 'error'
      state.error = action.payload
      state.isLookingUp = false
    },
    // Assistant transcript arrives as many small deltas sharing one item id;
    // accumulate them into a single growing entry instead of one bubble per delta.
    appendTranscript: (state, action: PayloadAction<TranscriptDelta>) => {
      const { itemId, text } = action.payload
      const existing = state.transcript.find((entry) => entry.id === itemId)
      if (existing) {
        existing.text += text
      } else {
        state.transcript.push({ id: itemId, role: 'assistant', text })
      }
    },
    lookupStarted: (state) => {
      state.isLookingUp = true
    },
    lookupFinished: (state) => {
      state.isLookingUp = false
    },
  },
})

export const {
  callConnecting,
  callLive,
  callEnded,
  callErrored,
  appendTranscript,
  lookupStarted,
  lookupFinished,
} = callSlice.actions
export default callSlice.reducer

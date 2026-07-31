import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Chat, ChatMessage } from '../../types/api'
import * as chatApi from '../../api/chat.api'
import type { SendMessageResponse } from '../../api/chat.api'

type SendStatus = 'idle' | 'sending' | 'error'

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  messages: ChatMessage[]
  sendStatus: SendStatus
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  messages: [],
  sendStatus: 'idle',
}

/** Lists the user's chats. */
export const fetchChats = createAsyncThunk('chat/fetchChats', () =>
  chatApi.listChats(),
)

/** Loads a chat with its messages. */
export const fetchChat = createAsyncThunk('chat/fetchChat', (id: string) =>
  chatApi.getChat(id),
)

/** Sends a message and returns the grounded answer. */
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  (payload: chatApi.SendMessagePayload) => chatApi.sendMessage(payload),
)

/** Renames a chat and returns the updated chat. */
export const renameChat = createAsyncThunk(
  'chat/rename',
  (args: { id: string; title: string }) =>
    chatApi.renameChat(args.id, args.title),
)

/** Deletes a chat and returns its id. */
export const deleteChat = createAsyncThunk(
  'chat/delete',
  async (id: string) => {
    await chatApi.deleteChat(id)
    return id
  },
)

function receiveAnswer(
  state: ChatState,
  action: PayloadAction<SendMessageResponse>,
) {
  state.activeChatId = action.payload.chatId
  state.messages.push({
    id: nanoid(),
    role: 'assistant',
    content: action.payload.answer,
    sources: action.payload.sources,
    createdAt: new Date().toISOString(),
  })
  state.sendStatus = 'idle'
}

function loadChat(state: ChatState, action: PayloadAction<Chat>) {
  state.activeChatId = action.payload.id
  state.messages = action.payload.messages ?? []
}

function applyRename(state: ChatState, action: PayloadAction<Chat>) {
  const chat = state.chats.find((item) => item.id === action.payload.id)
  if (chat) {
    chat.title = action.payload.title
  }
}

function applyDelete(state: ChatState, action: PayloadAction<string>) {
  state.chats = state.chats.filter((item) => item.id !== action.payload)
  if (state.activeChatId === action.payload) {
    state.activeChatId = null
    state.messages = []
  }
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startNewChat: (state) => {
      state.activeChatId = null
      state.messages = []
    },
    appendUserMessage: {
      reducer: (state, action: PayloadAction<ChatMessage>) => {
        state.messages.push(action.payload)
      },
      prepare: (content: string) => ({
        payload: {
          id: nanoid(),
          role: 'user' as const,
          content,
          createdAt: new Date().toISOString(),
        },
      }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
        state.chats = action.payload
      })
      .addCase(fetchChat.fulfilled, loadChat)
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = 'sending'
      })
      .addCase(sendMessage.fulfilled, receiveAnswer)
      .addCase(sendMessage.rejected, (state) => {
        state.sendStatus = 'error'
      })
      .addCase(renameChat.fulfilled, applyRename)
      .addCase(deleteChat.fulfilled, applyDelete)
  },
})

export const { startNewChat, appendUserMessage } = chatSlice.actions
export default chatSlice.reducer

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import toastReducer from '../features/toast/toastSlice'
import documentsReducer from '../features/documents/documentsSlice'
import chatReducer from '../features/chat/chatSlice'
import themeReducer from '../features/theme/themeSlice'
import callReducer from '../features/call/callSlice'

/** The application Redux store. */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    documents: documentsReducer,
    chat: chatReducer,
    theme: themeReducer,
    call: callReducer,
  },
})

/** Root state type inferred from the store. */
export type RootState = ReturnType<typeof store.getState>

/** Dispatch type inferred from the store (knows about thunks). */
export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import toastReducer from '../features/toast/toastSlice'

/** The application Redux store. */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
  },
})

/** Root state type inferred from the store. */
export type RootState = ReturnType<typeof store.getState>

/** Dispatch type inferred from the store (knows about thunks). */
export type AppDispatch = typeof store.dispatch

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthResult, AuthUser } from '../../types/api'
import * as authApi from '../../api/auth.api'
import type { LoginPayload, SignupPayload } from '../../api/auth.api'
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../../api/authToken'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  status: AuthStatus
  rehydrated: boolean
}

const existingToken = getStoredToken()

const initialState: AuthState = {
  user: null,
  accessToken: existingToken,
  status: existingToken ? 'loading' : 'unauthenticated',
  rehydrated: !existingToken,
}

/** Registers a new user, persisting the returned access token. */
export const signup = createAsyncThunk('auth/signup', async (payload: SignupPayload) => {
  const result = await authApi.signup(payload)
  setStoredToken(result.accessToken)
  return result
})

/** Logs a user in, persisting the returned access token. */
export const login = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const result = await authApi.login(payload)
  setStoredToken(result.accessToken)
  return result
})

/** Rehydrates the session on app boot by fetching the current user. */
export const fetchMe = createAsyncThunk('auth/fetchMe', () => authApi.fetchMe())

/** Logs out by clearing the persisted token. */
export const logout = createAsyncThunk('auth/logout', () => {
  clearStoredToken()
})

/** Marks the user authenticated from a signup/login result. */
function applyAuth(state: AuthState, action: PayloadAction<AuthResult>) {
  state.user = action.payload.user
  state.accessToken = action.payload.accessToken
  state.status = 'authenticated'
  state.rehydrated = true
}

/** Marks the user authenticated from a fetched profile. */
function applyUser(state: AuthState, action: PayloadAction<AuthUser>) {
  state.user = action.payload
  state.status = 'authenticated'
  state.rehydrated = true
}

/** Resets to the signed-out state. */
function applyLoggedOut(state: AuthState) {
  state.user = null
  state.accessToken = null
  state.status = 'unauthenticated'
  state.rehydrated = true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, applyUser)
      .addCase(fetchMe.rejected, applyLoggedOut)
      .addCase(login.fulfilled, applyAuth)
      .addCase(signup.fulfilled, applyAuth)
      .addCase(logout.fulfilled, applyLoggedOut)
  },
})

export default authSlice.reducer

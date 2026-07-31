import { http } from './axios'
import type { AuthResult, AuthUser } from '../types/api'

/** Payload for registering a new user. */
export interface SignupPayload {
  email: string
  password: string
  name?: string
}

/** Payload for logging in. */
export interface LoginPayload {
  email: string
  password: string
}

/** Registers a new user and returns the user with an access token. */
export function signup(payload: SignupPayload): Promise<AuthResult> {
  return http.post<AuthResult>('/auth/signup', payload)
}

/** Authenticates a user and returns the user with an access token. */
export function login(payload: LoginPayload): Promise<AuthResult> {
  return http.post<AuthResult>('/auth/login', payload)
}

/** Fetches the currently authenticated user. */
export function fetchMe(): Promise<AuthUser> {
  return http.get<AuthUser>('/auth/me')
}

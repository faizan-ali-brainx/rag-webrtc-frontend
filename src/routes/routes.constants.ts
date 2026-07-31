// Every route path in the app. Never write a path as a bare string literal
// anywhere else — import from here (Rule: constants over magic strings).
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DOCUMENTS: '/documents',
  CHAT: '/chat',
  CHAT_DETAIL: '/chat/:id',
  CALL: '/call',
} as const

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

/** Available color themes. */
export type ThemeMode = 'light' | 'dark'

/** localStorage key persisting the user's theme choice. */
export const THEME_STORAGE_KEY = 'rag.theme'

/** Resolves the initial theme from storage, falling back to the OS preference. */
function initialMode(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialMode() },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer

import { useEffect } from 'react'
import { useAppSelector } from '../../app/hooks'
import { THEME_STORAGE_KEY } from './themeSlice'

/** Applies the current theme to the document root and persists the choice. */
export function useApplyTheme(): void {
  const mode = useAppSelector((state) => state.theme.mode)
  useEffect(() => {
    document.documentElement.dataset.theme = mode
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }, [mode])
}

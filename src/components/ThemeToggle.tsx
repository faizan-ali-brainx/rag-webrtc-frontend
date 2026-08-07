import { useAppDispatch, useAppSelector } from '../app/hooks'
import { toggleTheme } from '../features/theme/themeSlice'
import styles from './ThemeToggle.module.scss'

/** Button that switches between light and dark themes. */
export function ThemeToggle() {
  const mode = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const isDark = mode === 'dark'
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? '☀' : '☾'}
    </button>
  )
}

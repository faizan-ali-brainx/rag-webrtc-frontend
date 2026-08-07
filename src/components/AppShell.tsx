import { Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { Button } from './Button'
import { HeaderNav } from './HeaderNav'
import { ThemeToggle } from './ThemeToggle'
import styles from './AppShell.module.scss'

/** Authenticated app layout: a header with the current user and logout, plus the routed page. */
export function AppShell() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>RAG Chat + Call</span>
        <HeaderNav />
        <div className={styles.userArea}>
          {user ? <span className={styles.email}>{user.email}</span> : null}
          <ThemeToggle />
          <Button variant="ghost" onClick={() => void dispatch(logout())}>
            Log out
          </Button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

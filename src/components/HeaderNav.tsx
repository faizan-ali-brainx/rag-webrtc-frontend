import { NavLink } from 'react-router-dom'
import { ROUTES } from '../routes/routes.constants'
import styles from './AppShell.module.scss'

/** Computes the nav link class based on active state. */
const linkClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? styles.activeLink : styles.link

/** Primary navigation shown in the app header. */
export function HeaderNav() {
  return (
    <nav className={styles.nav}>
      <NavLink to={ROUTES.DOCUMENTS} className={linkClass}>
        Documents
      </NavLink>
      <NavLink to={ROUTES.CHAT} className={linkClass}>
        Chat
      </NavLink>
    </nav>
  )
}

import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/routes.constants'
import styles from './NotFoundPage.module.scss'

/** A real 404 page — never a silent redirect (Rule 16). */
export function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.text}>This page could not be found.</p>
      <Link className={styles.link} to={ROUTES.HOME}>
        Go home
      </Link>
    </div>
  )
}

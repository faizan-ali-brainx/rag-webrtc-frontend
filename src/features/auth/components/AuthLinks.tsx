import { Link } from 'react-router-dom'
import styles from './AuthLinks.module.scss'

interface AuthLinksProps {
  prompt: string
  linkText: string
  to: string
}

/** A prompt plus a link shown beneath an auth form (e.g. "No account? Sign up"). */
export function AuthLinks({ prompt, linkText, to }: AuthLinksProps) {
  return (
    <p className={styles.links}>
      {prompt}{' '}
      <Link className={styles.link} to={to}>
        {linkText}
      </Link>
    </p>
  )
}

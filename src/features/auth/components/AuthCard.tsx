import type { ReactNode } from 'react'
import styles from './AuthCard.module.scss'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

/** Centered card wrapper shared by the login and signup pages. */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        {children}
      </div>
    </div>
  )
}

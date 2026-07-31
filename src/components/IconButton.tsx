import type { ReactNode } from 'react'
import styles from './IconButton.module.scss'

interface IconButtonProps {
  onClick: () => void
  label: string
  children: ReactNode
}

/** A small, borderless icon button with an accessible label. */
export function IconButton({ onClick, label, children }: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

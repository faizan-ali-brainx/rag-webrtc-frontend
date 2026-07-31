import styles from './FormError.module.scss'

interface FormErrorProps {
  message?: string | null
}

/** Displays a form-level error message when one is present. */
export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null
  }
  return (
    <p className={styles.error} role="alert">
      {message}
    </p>
  )
}

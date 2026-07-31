import { useEffect } from 'react'
import type { Toast } from './toastSlice'
import { TOAST_DISMISS_MS } from './toast.constants'
import styles from './ToastHost.module.scss'

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

/** A single auto-dismissing toast; clears its timer on unmount (Rule 12 cleanup). */
export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="status">
      <span>{toast.message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}

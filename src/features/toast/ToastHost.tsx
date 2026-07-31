import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { dismissToast } from './toastSlice'
import { ToastItem } from './ToastItem'
import styles from './ToastHost.module.scss'

/** Renders the stack of active toasts fixed to a screen corner. */
export function ToastHost() {
  const toasts = useAppSelector((state) => state.toast.toasts)
  const dispatch = useAppDispatch()
  const handleDismiss = useCallback(
    (id: string) => dispatch(dismissToast(id)),
    [dispatch],
  )

  return (
    <div className={styles.host} aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  )
}

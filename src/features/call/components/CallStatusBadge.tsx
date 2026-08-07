import styles from './CallStatusBadge.module.scss'

type CallStatus = 'idle' | 'connecting' | 'live' | 'error'

const LABELS: Record<CallStatus, string> = {
  idle: 'Not connected',
  connecting: 'Connecting…',
  live: 'Live',
  error: 'Error',
}

/** A colored pill reflecting the call's connection status. */
export function CallStatusBadge({ status }: { status: CallStatus }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{LABELS[status]}</span>
}

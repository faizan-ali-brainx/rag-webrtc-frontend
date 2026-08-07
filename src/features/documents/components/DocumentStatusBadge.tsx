import type { DocStatus } from '../../../types/api'
import styles from './DocumentStatusBadge.module.scss'

interface DocumentStatusBadgeProps {
  status: DocStatus
}

/** A colored pill reflecting a document's ingestion status. */
export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      {status}
    </span>
  )
}

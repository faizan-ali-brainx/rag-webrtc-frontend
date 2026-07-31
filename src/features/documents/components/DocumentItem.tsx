import type { Document } from '../../../types/api'
import { Button } from '../../../components/Button'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import styles from './DocumentItem.module.scss'

interface DocumentItemProps {
  doc: Document
  onDelete: (id: string) => void
}

/** Formats a byte count as a compact KB string. */
function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}

/** A single document row: name, size/status, and a delete action. */
export function DocumentItem({ doc, onDelete }: DocumentItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <span className={styles.name}>{doc.filename}</span>
        <span className={styles.meta} title={doc.error ?? undefined}>
          {formatSize(doc.sizeBytes)}
          {doc.status === 'FAILED' && doc.error ? ` · ${doc.error}` : ''}
        </span>
      </div>
      <div className={styles.actions}>
        <DocumentStatusBadge status={doc.status} />
        <Button variant="ghost" onClick={() => onDelete(doc.id)}>
          Delete
        </Button>
      </div>
    </li>
  )
}

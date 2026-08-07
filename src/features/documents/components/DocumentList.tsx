import type { Document } from '../../../types/api'
import { DocumentItem } from './DocumentItem'
import styles from './DocumentList.module.scss'

interface DocumentListProps {
  items: Document[]
  onDelete: (id: string) => void
}

/** Renders the list of uploaded documents. */
export function DocumentList({ items, onDelete }: DocumentListProps) {
  return (
    <ul className={styles.list}>
      {items.map((doc) => (
        <DocumentItem key={doc.id} doc={doc} onDelete={onDelete} />
      ))}
    </ul>
  )
}

import { IconButton } from '../../../components/IconButton'
import styles from './ChatSidebar.module.scss'

interface ChatItemActionsProps {
  onEdit: () => void
  onDelete: () => void
}

/** Rename and delete buttons revealed on hovering a chat row. */
export function ChatItemActions({ onEdit, onDelete }: ChatItemActionsProps) {
  return (
    <div className={styles.actions}>
      <IconButton onClick={onEdit} label="Rename chat">
        ✎
      </IconButton>
      <IconButton onClick={onDelete} label="Delete chat">
        🗑
      </IconButton>
    </div>
  )
}

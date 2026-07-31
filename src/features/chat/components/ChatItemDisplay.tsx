import { Link } from 'react-router-dom'
import type { Chat } from '../../../types/api'
import { chatPath } from '../../../routes/routes.constants'
import { ChatItemActions } from './ChatItemActions'
import styles from './ChatSidebar.module.scss'

interface ChatItemDisplayProps {
  chat: Chat
  onEdit: () => void
  onDelete: () => void
}

/** The non-editing view of a chat row: title link plus hover actions. */
export function ChatItemDisplay({ chat, onEdit, onDelete }: ChatItemDisplayProps) {
  return (
    <>
      <Link className={styles.link} to={chatPath(chat.id)}>
        {chat.title ?? 'Untitled'}
      </Link>
      <ChatItemActions onEdit={onEdit} onDelete={onDelete} />
    </>
  )
}

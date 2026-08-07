import type { ChatMessage } from '../../../types/api'
import { SourceChips } from './SourceChips'
import styles from './MessageBubble.module.scss'

/** A single chat message bubble; assistant messages show source chips. */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`${styles.row} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.bubble}>
        <p className={styles.content}>{message.content}</p>
        {!isUser && message.sources ? (
          <SourceChips sources={message.sources} />
        ) : null}
      </div>
    </div>
  )
}

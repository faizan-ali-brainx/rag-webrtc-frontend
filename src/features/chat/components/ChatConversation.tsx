import type { ChatMessage } from '../../../types/api'
import { ChatComposer } from './ChatComposer'
import { ChatEmptyDocsNotice } from './ChatEmptyDocsNotice'
import { MessageList } from './MessageList'
import styles from './ChatConversation.module.scss'

interface ChatConversationProps {
  messages: ChatMessage[]
  pending: boolean
  hasReadyDocs: boolean
  onSend: (message: string) => void
}

/** The conversation column: optional no-docs notice, messages, and composer. */
export function ChatConversation({
  messages,
  pending,
  hasReadyDocs,
  onSend,
}: ChatConversationProps) {
  return (
    <section className={styles.main}>
      {!hasReadyDocs ? <ChatEmptyDocsNotice /> : null}
      <MessageList messages={messages} pending={pending} />
      <ChatComposer onSend={onSend} disabled={pending} />
    </section>
  )
}

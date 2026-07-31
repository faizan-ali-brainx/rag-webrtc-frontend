import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../../types/api'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import styles from './MessageList.module.scss'

interface MessageListProps {
  messages: ChatMessage[]
  pending: boolean
}

/** Scrollable message list; shows a typing indicator and auto-scrolls to bottom. */
export function MessageList({ messages, pending }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, pending])

  return (
    <div className={styles.list}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {pending ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  )
}

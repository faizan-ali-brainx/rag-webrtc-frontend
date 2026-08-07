import type { Chat } from '../../../types/api'
import { ChatItemDisplay } from './ChatItemDisplay'
import { ChatTitleEditor } from './ChatTitleEditor'

interface ChatItemBodyProps {
  chat: Chat
  editing: boolean
  onSave: (title: string) => void
  onCancel: () => void
  onEdit: () => void
  onDelete: () => void
}

/** Renders either the inline rename editor or the chat display row. */
export function ChatItemBody({
  chat,
  editing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: ChatItemBodyProps) {
  if (editing) {
    return (
      <ChatTitleEditor initial={chat.title ?? ''} onSave={onSave} onCancel={onCancel} />
    )
  }
  return <ChatItemDisplay chat={chat} onEdit={onEdit} onDelete={onDelete} />
}

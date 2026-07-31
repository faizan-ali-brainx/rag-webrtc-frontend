import { useState } from 'react'
import type { Chat } from '../../../types/api'
import { ChatItemBody } from './ChatItemBody'
import styles from './ChatSidebar.module.scss'

interface ChatSidebarItemProps {
  chat: Chat
  isActive: boolean
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

/** A sidebar row that toggles between a display view and an inline rename editor. */
export function ChatSidebarItem(props: ChatSidebarItemProps) {
  const { chat, isActive, onRename, onDelete } = props
  const [editing, setEditing] = useState(false)
  const save = (title: string) => {
    onRename(chat.id, title)
    setEditing(false)
  }

  return (
    <li className={`${styles.item} ${!editing && isActive ? styles.active : ''}`}>
      <ChatItemBody
        chat={chat}
        editing={editing}
        onSave={save}
        onCancel={() => setEditing(false)}
        onEdit={() => setEditing(true)}
        onDelete={() => onDelete(chat.id)}
      />
    </li>
  )
}

import type { Chat } from '../../../types/api'
import { ChatSidebarItem } from './ChatSidebarItem'
import styles from './ChatSidebar.module.scss'

interface ChatListProps {
  chats: Chat[]
  activeChatId: string | null
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

/** The list of chat rows in the sidebar. */
export function ChatList({ chats, activeChatId, onRename, onDelete }: ChatListProps) {
  return (
    <ul className={styles.list}>
      {chats.map((chat) => (
        <ChatSidebarItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

import { Button } from '../../../components/Button'
import type { Chat } from '../../../types/api'
import { ChatList } from './ChatList'
import styles from './ChatSidebar.module.scss'

interface ChatSidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onNew: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

/** Sidebar with a new-chat action and the list of prior chats. */
export function ChatSidebar({
  chats,
  activeChatId,
  onNew,
  onRename,
  onDelete,
}: ChatSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Button variant="ghost" onClick={onNew}>
        + New chat
      </Button>
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onRename={onRename}
        onDelete={onDelete}
      />
    </aside>
  )
}

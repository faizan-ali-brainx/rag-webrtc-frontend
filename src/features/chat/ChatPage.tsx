import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../routes/routes.constants'
import { ChatConversation } from './components/ChatConversation'
import { ChatSidebar } from './components/ChatSidebar'
import { useChatPage } from './hooks/useChatPage'
import styles from './ChatPage.module.scss'

/** Chat page (view): sidebar of chats and the active conversation. */
export function ChatPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const page = useChatPage(id)

  return (
    <div className={styles.layout}>
      <ChatSidebar
        chats={page.chats}
        activeChatId={page.activeChatId}
        onNew={() => navigate(ROUTES.CHAT)}
        onRename={page.rename}
        onDelete={page.remove}
      />
      <ChatConversation
        messages={page.messages}
        pending={page.sendStatus === 'sending'}
        hasReadyDocs={page.hasReadyDocs}
        onSend={page.send}
      />
    </div>
  )
}

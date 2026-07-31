import { useAppSelector } from '../../../app/hooks'
import { useChatActions } from './useChatActions'
import { useChatLoad } from './useChatLoad'

/** Controller hook for the chat page: exposes state and mutation actions. */
export function useChatPage(chatId?: string) {
  useChatLoad(chatId)
  const messages = useAppSelector((state) => state.chat.messages)
  const chats = useAppSelector((state) => state.chat.chats)
  const sendStatus = useAppSelector((state) => state.chat.sendStatus)
  const activeChatId = useAppSelector((state) => state.chat.activeChatId)
  const hasReadyDocs = useAppSelector((state) =>
    state.documents.items.some((doc) => doc.status === 'READY'),
  )
  const actions = useChatActions(activeChatId)

  return { messages, chats, sendStatus, activeChatId, hasReadyDocs, ...actions }
}

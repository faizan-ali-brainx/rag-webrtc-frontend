import { useEffect } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { fetchDocuments } from '../../documents/documentsSlice'
import { fetchChat, fetchChats, startNewChat } from '../chatSlice'

/**
 * Loads the data the chat page needs: the chat list and the user's documents on
 * mount, and either the selected chat or a fresh conversation when the id changes.
 */
export function useChatLoad(chatId?: string): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    void dispatch(fetchChats())
    void dispatch(fetchDocuments())
  }, [dispatch])

  useEffect(() => {
    if (chatId) {
      void dispatch(fetchChat(chatId))
    } else {
      dispatch(startNewChat())
    }
  }, [dispatch, chatId])
}

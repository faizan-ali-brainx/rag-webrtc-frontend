import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { ROUTES } from '../../../routes/routes.constants'
import { runWithToast } from '../../toast/runWithToast'
import {
  appendUserMessage,
  deleteChat,
  renameChat,
  sendMessage,
} from '../chatSlice'

/** Chat mutation handlers: send a message, rename a chat, delete a chat. */
export function useChatActions(activeChatId: string | null) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const send = (message: string) => {
    dispatch(appendUserMessage(message))
    const payload = { message, chatId: activeChatId ?? undefined }
    return runWithToast(dispatch, dispatch(sendMessage(payload)).unwrap())
  }

  const rename = (id: string, title: string) =>
    runWithToast(dispatch, dispatch(renameChat({ id, title })).unwrap(), 'Chat renamed')

  const remove = async (id: string) => {
    await runWithToast(dispatch, dispatch(deleteChat(id)).unwrap(), 'Chat deleted')
    if (id === activeChatId) navigate(ROUTES.CHAT)
  }

  return { send, rename, remove }
}

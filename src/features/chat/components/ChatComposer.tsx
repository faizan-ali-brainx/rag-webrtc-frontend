import { Button } from '../../../components/Button'
import { MESSAGE_MAX_LENGTH } from '../chat.constants'
import { useComposer } from '../hooks/useComposer'
import styles from './ChatComposer.module.scss'

interface ChatComposerProps {
  onSend: (message: string) => void
  disabled: boolean
}

/** Message input with a send button; clears on submit. */
export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const { value, setValue, submit, onKeyDown } = useComposer(onSend)
  return (
    <form className={styles.composer} onSubmit={submit}>
      <textarea
        className={styles.input}
        value={value}
        rows={2}
        maxLength={MESSAGE_MAX_LENGTH}
        placeholder="Ask a question…  (Enter to send, Shift+Enter for a new line)"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button type="submit" loading={disabled}>
        Send
      </Button>
    </form>
  )
}

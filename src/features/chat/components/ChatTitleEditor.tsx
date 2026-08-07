import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import styles from './ChatSidebar.module.scss'

interface ChatTitleEditorProps {
  initial: string
  onSave: (title: string) => void
  onCancel: () => void
}

/** Inline text input for renaming a chat (Enter saves, Escape cancels). */
export function ChatTitleEditor({ initial, onSave, onCancel }: ChatTitleEditorProps) {
  const [title, setTitle] = useState(initial)
  const save = () => {
    const trimmed = title.trim()
    if (trimmed) onSave(trimmed)
    else onCancel()
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') save()
    else if (event.key === 'Escape') onCancel()
  }
  return (
    <input
      className={styles.edit}
      value={title}
      autoFocus
      onChange={(e) => setTitle(e.target.value)}
      onBlur={save}
      onKeyDown={onKeyDown}
    />
  )
}

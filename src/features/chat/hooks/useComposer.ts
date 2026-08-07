import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'

/** Local state + submit handling for the chat composer input. */
export function useComposer(onSend: (message: string) => void) {
  const [value, setValue] = useState('')

  const send = () => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send()
  }

  // Enter sends; Shift+Enter inserts a newline (as in most chat UIs).
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return { value, setValue, submit, onKeyDown }
}

import { useRef } from 'react'
import type { DragEvent } from 'react'

/** File selection state/handlers shared by the upload dropzone. */
export function useDropzone(onUpload: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pick = (files: FileList | null) => {
    const file = files?.[0]
    if (file) onUpload(file)
  }
  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    pick(event.dataTransfer.files)
  }
  const open = () => inputRef.current?.click()
  return { inputRef, pick, onDrop, open }
}

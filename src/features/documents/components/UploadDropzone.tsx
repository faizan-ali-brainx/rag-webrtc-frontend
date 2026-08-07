import { ACCEPTED_EXTENSIONS } from '../documents.constants'
import { useDropzone } from '../hooks/useDropzone'
import styles from './UploadDropzone.module.scss'

interface UploadDropzoneProps {
  onUpload: (file: File) => void
  uploading: boolean
}

/** Click-or-drop file upload area. */
export function UploadDropzone({ onUpload, uploading }: UploadDropzoneProps) {
  const { inputRef, pick, onDrop, open } = useDropzone(onUpload)
  return (
    <div
      className={styles.dropzone}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={open}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        hidden
        onChange={(e) => pick(e.target.files)}
      />
      <p className={styles.hint}>
        {uploading ? 'Uploading…' : 'Drop a PDF, TXT, or MD file here, or click to choose'}
      </p>
    </div>
  )
}

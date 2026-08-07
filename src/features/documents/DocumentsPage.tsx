import { EmptyState } from '../../components/EmptyState'
import { Spinner } from '../../components/Spinner'
import { DocumentList } from './components/DocumentList'
import { UploadDropzone } from './components/UploadDropzone'
import { useDocumentsPage } from './hooks/useDocumentsPage'
import styles from './DocumentsPage.module.scss'

/** Documents page (view): upload area plus the list of uploaded documents. */
export function DocumentsPage() {
  const { items, listStatus, uploadStatus, upload, remove } = useDocumentsPage()
  const isEmpty = items.length === 0 && listStatus !== 'loading'

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Documents</h1>
      <UploadDropzone onUpload={upload} uploading={uploadStatus === 'uploading'} />
      {listStatus === 'loading' && items.length === 0 ? <Spinner /> : null}
      {isEmpty ? (
        <EmptyState
          title="No documents yet"
          description="Upload a PDF, TXT, or MD file to start asking questions."
        />
      ) : (
        <DocumentList items={items} onDelete={remove} />
      )}
    </div>
  )
}

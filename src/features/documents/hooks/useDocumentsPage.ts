import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { runWithToast } from '../../toast/runWithToast'
import {
  deleteDocument,
  fetchDocuments,
  uploadDocument,
} from '../documentsSlice'
import { useDocumentPolling } from './useDocumentPolling'

/** Controller hook for the documents page: data, polling, upload, and delete. */
export function useDocumentsPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.documents.items)
  const listStatus = useAppSelector((state) => state.documents.listStatus)
  const uploadStatus = useAppSelector((state) => state.documents.uploadStatus)

  useEffect(() => {
    void dispatch(fetchDocuments())
  }, [dispatch])
  useDocumentPolling(items)

  const upload = useCallback(
    (file: File) =>
      runWithToast(dispatch, dispatch(uploadDocument(file)).unwrap(), 'Document uploaded'),
    [dispatch],
  )
  const remove = useCallback(
    (id: string) =>
      runWithToast(dispatch, dispatch(deleteDocument(id)).unwrap(), 'Document deleted'),
    [dispatch],
  )

  return { items, listStatus, uploadStatus, upload, remove }
}

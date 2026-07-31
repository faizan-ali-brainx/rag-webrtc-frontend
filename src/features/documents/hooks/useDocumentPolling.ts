import { useEffect } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import type { Document } from '../../../types/api'
import { fetchDocuments } from '../documentsSlice'
import { POLL_INTERVAL_MS } from '../documents.constants'

/**
 * Re-fetches documents on an interval while any document is still PROCESSING,
 * and clears the interval when nothing is processing or on unmount.
 */
export function useDocumentPolling(items: Document[]): void {
  const dispatch = useAppDispatch()
  const hasProcessing = items.some((doc) => doc.status === 'PROCESSING')

  useEffect(() => {
    if (!hasProcessing) {
      return
    }
    const timer = window.setInterval(() => {
      void dispatch(fetchDocuments())
    }, POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [dispatch, hasProcessing])
}

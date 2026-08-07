import { Link } from 'react-router-dom'
import { EmptyState } from '../../../components/EmptyState'
import { ROUTES } from '../../../routes/routes.constants'

/** Notice shown in chat when the user has no READY documents yet. */
export function ChatEmptyDocsNotice() {
  return (
    <EmptyState
      title="No documents ready"
      description="Upload a document before asking questions."
      action={<Link to={ROUTES.DOCUMENTS}>Go to documents</Link>}
    />
  )
}

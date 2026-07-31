import { useAppSelector } from '../app/hooks'
import { EmptyState } from '../components/EmptyState'

/** Temporary authenticated landing page for phase 1; feature pages arrive later. */
export function HomePage() {
  const user = useAppSelector((state) => state.auth.user)
  const greetingName = user?.name || user?.email || 'there'

  return (
    <EmptyState
      title={`Welcome, ${greetingName}`}
      description="Your account is set up. Document upload, chat, and voice calls arrive in the next phases."
    />
  )
}

import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { AppShell } from '../components/AppShell'
import { Spinner } from '../components/Spinner'
import { ROUTES } from './routes.constants'

/** Gates authenticated routes: waits for rehydration, then admits or redirects to login. */
export function ProtectedRoute() {
  const status = useAppSelector((state) => state.auth.status)
  const rehydrated = useAppSelector((state) => state.auth.rehydrated)

  if (!rehydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (status !== 'authenticated') {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return <AppShell />
}

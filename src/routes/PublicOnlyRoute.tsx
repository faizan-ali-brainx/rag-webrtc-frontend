import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { ROUTES } from './routes.constants'

/** Keeps already-authenticated users off the login/signup pages. */
export function PublicOnlyRoute() {
  const status = useAppSelector((state) => state.auth.status)
  if (status === 'authenticated') {
    return <Navigate to={ROUTES.HOME} replace />
  }
  return <Outlet />
}

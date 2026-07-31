import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchMe } from '../authSlice'

/**
 * On app boot, restores the session by fetching the current user when a token
 * is present but the session has not yet been rehydrated.
 */
export function useSessionRehydration(): void {
  const dispatch = useAppDispatch()
  const rehydrated = useAppSelector((state) => state.auth.rehydrated)

  useEffect(() => {
    if (!rehydrated) {
      void dispatch(fetchMe())
    }
  }, [dispatch, rehydrated])
}

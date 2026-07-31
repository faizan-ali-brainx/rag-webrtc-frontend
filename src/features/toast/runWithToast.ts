import type { AppDispatch } from '../../app/store'
import { GENERIC_ERROR_MESSAGE } from '../../api/apiError'
import { showToast } from './toastSlice'

/**
 * Awaits a thunk's unwrapped result promise, always showing an error toast on
 * failure and optionally a success toast when `successMessage` is provided.
 * Call as `runWithToast(dispatch, dispatch(someThunk(arg)).unwrap(), 'Done!')`.
 * Returns the resolved value, or undefined if the promise rejected.
 */
export async function runWithToast<T>(
  dispatch: AppDispatch,
  resultPromise: Promise<T>,
  successMessage?: string,
): Promise<T | undefined> {
  try {
    const result = await resultPromise
    if (successMessage) {
      dispatch(showToast('success', successMessage))
    }
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE
    dispatch(showToast('error', message))
    return undefined
  }
}

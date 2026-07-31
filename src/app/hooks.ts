import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/** Typed `useDispatch` — always use this instead of the raw react-redux hook. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/** Typed `useSelector` — always use this instead of the raw react-redux hook. */
export const useAppSelector = useSelector.withTypes<RootState>()

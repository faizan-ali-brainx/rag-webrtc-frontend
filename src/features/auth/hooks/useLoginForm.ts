import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { GENERIC_ERROR_MESSAGE } from '../../../api/apiError'
import { ROUTES } from '../../../routes/routes.constants'
import { showToast } from '../../toast/toastSlice'
import { login } from '../authSlice'
import { loginSchema } from '../auth.schemas'
import type { LoginFormValues } from '../auth.schemas'

/** Controller hook for the login form: validation, submit, and error state. */
export function useLoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await dispatch(login(values)).unwrap()
      dispatch(showToast('success', 'Welcome back'))
      navigate(ROUTES.HOME, { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE)
    }
  })

  return { form, onSubmit, submitError }
}

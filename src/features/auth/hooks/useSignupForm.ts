import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { GENERIC_ERROR_MESSAGE } from '../../../api/apiError'
import { ROUTES } from '../../../routes/routes.constants'
import { showToast } from '../../toast/toastSlice'
import { signup } from '../authSlice'
import { signupSchema } from '../auth.schemas'
import type { SignupFormValues } from '../auth.schemas'

/** Controller hook for the signup form: validation, submit, and error state. */
export function useSignupForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) })

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await dispatch(signup(values)).unwrap()
      dispatch(showToast('success', 'Account created'))
      navigate(ROUTES.HOME, { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE)
    }
  })

  return { form, onSubmit, submitError }
}

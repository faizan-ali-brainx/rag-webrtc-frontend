import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { TextField } from '../../../components/TextField'
import type { LoginFormValues } from '../auth.schemas'

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginFormValues>
  errors: FieldErrors<LoginFormValues>
}

/** Email + password inputs for the login form. */
export function LoginFormFields({ register, errors }: LoginFormFieldsProps) {
  return (
    <>
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
    </>
  )
}

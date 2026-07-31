import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { TextField } from '../../../components/TextField'
import type { SignupFormValues } from '../auth.schemas'

interface SignupFormFieldsProps {
  register: UseFormRegister<SignupFormValues>
  errors: FieldErrors<SignupFormValues>
}

interface FieldConfig {
  id: keyof SignupFormValues
  label: string
  type: string
  autoComplete: string
}

const SIGNUP_FIELDS: readonly FieldConfig[] = [
  { id: 'name', label: 'Name (optional)', type: 'text', autoComplete: 'name' },
  { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
]

/** Name + email + password inputs for the signup form. */
export function SignupFormFields({ register, errors }: SignupFormFieldsProps) {
  return (
    <>
      {SIGNUP_FIELDS.map((field) => (
        <TextField
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type}
          autoComplete={field.autoComplete}
          error={errors[field.id]?.message}
          {...register(field.id)}
        />
      ))}
    </>
  )
}

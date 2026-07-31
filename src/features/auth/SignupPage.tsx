import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
import { ROUTES } from '../../routes/routes.constants'
import { AuthCard } from './components/AuthCard'
import { AuthLinks } from './components/AuthLinks'
import { SignupFormFields } from './components/SignupFormFields'
import { useSignupForm } from './hooks/useSignupForm'

// SignupPage is the view; all logic lives in useSignupForm. It composes AuthCard,
// so it needs no *.module.scss of its own.
export function SignupPage() {
  const { form, onSubmit, submitError } = useSignupForm()

  return (
    <AuthCard title="Create account" subtitle="Start using RAG Chat + Call">
      <form onSubmit={onSubmit} noValidate>
        <FormError message={submitError} />
        <SignupFormFields register={form.register} errors={form.formState.errors} />
        <Button type="submit" loading={form.formState.isSubmitting}>
          Sign up
        </Button>
      </form>
      <AuthLinks prompt="Already have an account?" linkText="Log in" to={ROUTES.LOGIN} />
    </AuthCard>
  )
}

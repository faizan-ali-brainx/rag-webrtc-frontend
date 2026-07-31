import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
import { ROUTES } from '../../routes/routes.constants'
import { AuthCard } from './components/AuthCard'
import { AuthLinks } from './components/AuthLinks'
import { LoginFormFields } from './components/LoginFormFields'
import { useLoginForm } from './hooks/useLoginForm'

// LoginPage is the view; all logic lives in useLoginForm. It composes AuthCard,
// so it needs no *.module.scss of its own.
export function LoginPage() {
  const { form, onSubmit, submitError } = useLoginForm()

  return (
    <AuthCard title="Log in" subtitle="Welcome back">
      <form onSubmit={onSubmit} noValidate>
        <FormError message={submitError} />
        <LoginFormFields register={form.register} errors={form.formState.errors} />
        <Button type="submit" loading={form.formState.isSubmitting}>
          Log in
        </Button>
      </form>
      <AuthLinks prompt="No account?" linkText="Sign up" to={ROUTES.SIGNUP} />
    </AuthCard>
  )
}

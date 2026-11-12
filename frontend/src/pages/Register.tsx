import AuthForm, { type AuthFormProps } from '../components/auth/AuthForm'

type RegisterProps = Pick<AuthFormProps, 'error' | 'onSwitch'> & {
  onRegister: AuthFormProps['onSubmit']
}

export default function Register({ onRegister, onSwitch, error }: RegisterProps) {
  return <AuthForm mode="signup" onSubmit={onRegister} onSwitch={onSwitch} error={error} />
}

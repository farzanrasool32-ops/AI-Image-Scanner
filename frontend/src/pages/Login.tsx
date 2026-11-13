import AuthForm, { type AuthFormProps } from "../components/auth/AuthForm";

type LoginProps = Pick<AuthFormProps, "error" | "onSwitch"> & {
  onLogin: AuthFormProps["onSubmit"];
};

export default function Login({ onLogin, onSwitch, error }: LoginProps) {
  return (
    <AuthForm
      mode="login"
      onSubmit={onLogin}
      onSwitch={onSwitch}
      error={error}
    />
  );
}

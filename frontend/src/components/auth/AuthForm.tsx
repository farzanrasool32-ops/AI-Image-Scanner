import { useState, type FormEvent } from "react";
import { ScanLine } from "lucide-react";

export type AuthFormProps = {
  mode: "login" | "signup";
  error: string;
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  onSwitch: () => void;
};

export default function AuthForm({
  mode,
  error: initialError,
  onSubmit,
  onSwitch,
}: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "signup";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim(), email.trim(), password);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not complete the request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand">
          <span className="brand-mark">
            <ScanLine size={21} strokeWidth={2.2} />
          </span>
          <span className="brand-name">
            visio<span>lab</span>
          </span>
        </div>
        <span className="eyebrow">
          <i className="eyebrow-line" /> YOUR IMAGE WORKSPACE
        </span>
        <h1 id="auth-title">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-description">
          {isSignUp
            ? "Sign up to start exploring your images."
            : "Sign in to continue to your workspace."}
        </p>
        <form className="auth-form" onSubmit={submit}>
          {isSignUp && (
            <label>
              Name
              <input
                autoComplete="name"
                maxLength={80}
                minLength={1}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          )}
          <label>
            Email
            <input
              autoComplete="email"
              maxLength={254}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            Password
            <input
              autoComplete={isSignUp ? "new-password" : "current-password"}
              maxLength={72}
              minLength={isSignUp ? 8 : undefined}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {(error || initialError) && (
            <p className="auth-error" role="alert">
              {error || initialError}
            </p>
          )}
          <button
            className="button button-primary auth-submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait…"
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          {isSignUp ? "Already have an account?" : "New to VisioLab?"}
          <button onClick={onSwitch} type="button">
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}

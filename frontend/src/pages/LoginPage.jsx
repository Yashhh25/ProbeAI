import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';
import useLogin from '../hooks/useLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, errorMessage } = useLogin();

  function handleSubmit(event) {
    event.preventDefault();
    login({ email, password });
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to collect customer insights at scale"
      footer={
        <p className="ds-body">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="ds-link">
            Create one
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {errorMessage ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          disabled={isLoading}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          disabled={isLoading}
        />

        <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
      </form>
    </AuthCard>
  );
}

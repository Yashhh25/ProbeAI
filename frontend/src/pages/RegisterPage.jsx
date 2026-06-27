import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import FormField from '../components/auth/FormField';
import SubmitButton from '../components/auth/SubmitButton';
import useRegister from '../hooks/useRegister';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, errorMessage } = useRegister();

  function handleSubmit(event) {
    event.preventDefault();
    register({ name, email, password });
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Create AI-powered research interviews and turn conversations into actionable feedback"
      footer={
        <p className="ds-body">
          Already have an account?{' '}
          <Link to="/login" className="ds-link">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <FormField
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          disabled={isLoading}
        />

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
          autoComplete="new-password"
          disabled={isLoading}

          
        />
        
        {errorMessage ? (
          <p
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
        

        <SubmitButton isLoading={isLoading}>Create account</SubmitButton>
      </form>
    </AuthCard>
  );
}

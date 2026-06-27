import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import { setToken } from '../utils/token';

function getAuthErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

export default function useRegister() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data?.token) {
        setToken(data.token);
      }

      navigate('/dashboard', { replace: true });
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    errorMessage: mutation.error ? getAuthErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}

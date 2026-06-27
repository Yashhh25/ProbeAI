import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInterview } from '../services/interview.service';

export default function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterview,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['interviews'],
      });
    },
  });
}
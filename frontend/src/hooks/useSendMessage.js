import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../services/message.service';

export default function useSendMessage(interviewId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageData) =>
      sendMessage(interviewId, messageData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transcript', interviewId],
      });
      queryClient.invalidateQueries({
        queryKey: ['interview', interviewId],
      });
      queryClient.invalidateQueries({
        queryKey: ['insights', interviewId],
      });
    },
  });
}
import { useQuery } from '@tanstack/react-query';
import { getTranscript } from '../services/message.service';

export default function useTranscript(interviewId) {
  return useQuery({
    queryKey: ['transcript', interviewId],
    queryFn: () => getTranscript(interviewId),
    enabled: !!interviewId,
  });
}
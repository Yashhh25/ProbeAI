import { useQuery } from '@tanstack/react-query';
import { getInterviewById } from '../services/interview.service';

export default function useInterview(interviewId) {
  return useQuery({
    queryKey: ['interview', interviewId],
    queryFn: () => getInterviewById(interviewId),
    enabled: !!interviewId,
  });
}

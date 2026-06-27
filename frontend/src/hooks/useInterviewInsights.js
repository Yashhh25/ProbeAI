import { useQuery } from '@tanstack/react-query';
import { getInterviewInsights } from '../services/interview.service';

export default function useInterviewInsights(interviewId) {
  return useQuery({
    queryKey: ['insights', interviewId],
    queryFn: () => getInterviewInsights(interviewId),
    enabled: !!interviewId,
    refetchInterval: 5000, // Poll every 5 seconds to fetch background-generated insights
  });
}

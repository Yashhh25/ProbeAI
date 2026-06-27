import { useQuery } from '@tanstack/react-query';
import { getInterviews } from '../services/interview.service';

export default function useInterviews() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: getInterviews,
  });
}
import { useQuery } from '@tanstack/react-query';
import { getReport } from '../services/report.service';

export default function useReport(interviewId) {
  return useQuery({
    queryKey: ['report', interviewId],
    queryFn: () => getReport(interviewId),
    enabled: !!interviewId,
    retry: false,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateReport } from '../services/report.service';

export default function useGenerateReport(interviewId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => generateReport(id || interviewId),
    onSuccess: (data, targetId) => {
      const activeId = targetId || interviewId;
      if (activeId) {
        queryClient.setQueryData(['report', activeId], data);
        queryClient.invalidateQueries({ queryKey: ['report', activeId] });
      }
    },
  });
}
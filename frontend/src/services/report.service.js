import api from '../lib/axios';

export async function generateReport(interviewId) {
  const response = await api.post(
    `/api/v1/interviews/${interviewId}/report`
  );

  return response.data.data;
}

export async function getReport(interviewId) {
  const response = await api.get(
    `/api/v1/interviews/${interviewId}/report`
  );

  return response.data.data;
}

export async function downloadReportPdf(interviewId) {
  const response = await api.get(
    `/api/v1/interviews/${interviewId}/report/pdf`,
    {
      responseType: 'blob',
    }
  );

  return response.data;
}
import api from '../lib/axios';

export async function createInterview(interviewData) {
  const response = await api.post(
    '/api/v1/interviews',
    interviewData
  );

  return response.data.data;
}

export async function getInterviews() {
  const response = await api.get('/api/v1/interviews');

  return response.data.data;
}

export async function getTranscript(interviewId) {
  const response = await api.get(
    `/api/v1/interviews/${interviewId}/messages`
  );

  return response.data.data;
}

export async function getInterviewInsights(interviewId) {
  const response = await api.get(
    `/api/v1/interviews/${interviewId}/insights`
  );

  return response.data.data;
}
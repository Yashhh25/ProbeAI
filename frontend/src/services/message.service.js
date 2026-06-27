import api from '../lib/axios';

export async function getTranscript(interviewId) {
  const response = await api.get(
    `/api/v1/interviews/${interviewId}/messages`
  );

  return response.data.data;
}

export async function sendMessage(
  interviewId,
  messageData
) {
  const response = await api.post(
    `/api/v1/interviews/${interviewId}/messages`,
    messageData
  );

  return response.data.data;
}
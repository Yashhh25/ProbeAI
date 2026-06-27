import api from '../lib/axios';
import { setToken } from '../utils/token';

export async function register(userData) {
  const response = await api.post('/api/v1/auth/register', userData);
  const { data } = response.data;

  if (data?.token) {
    setToken(data.token);
  }

  return data;
}

export async function login(credentials) {
  const response = await api.post('/api/v1/auth/login', credentials);
  const { data } = response.data;

  if (data?.token) {
    setToken(data.token);
  }

  return data;
}

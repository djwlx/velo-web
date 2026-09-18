import { request } from '@/utils/request';
import type { AuthResponse, MeResponse } from './types';

export const register = (email: string, password: string) => request<AuthResponse>('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

export const login = (email: string, password: string) => request<AuthResponse>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

export const getCurrentUser = () => request<MeResponse>('/auth/me');

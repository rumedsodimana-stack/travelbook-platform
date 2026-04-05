import { api } from './api';

export interface LoginPayload { email: string; password: string; }
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: { id: string; name: string; email: string; role: string; propertyId: string; };
}

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthTokens>('/auth/login', payload).then(r => r.data),
  logout: () => api.post('/auth/logout').catch(() => {}),
  me: () => api.get<AuthTokens['user']>('/auth/me').then(r => r.data),
};

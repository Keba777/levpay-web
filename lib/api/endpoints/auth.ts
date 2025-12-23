import apiClient from '../client';
import { LoginFormData, RegistrationFormData, TwoFactorData } from '@/lib/validations/auth';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'admin';
    is_2fa_enabled: boolean;
  };
  requires_2fa?: boolean;
}

export const authAPI = {
  // Register new user
  register: async (data: RegistrationFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login with email/password
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  // Google OAuth login
  googleAuth: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/google', {
      token,
    });
    return response.data;
  },

  // Verify 2FA code
  verify2FA: async (data: TwoFactorData & { email: string }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-2fa', data);
    return response.data;
  },

  // Get current user
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

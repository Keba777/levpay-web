import apiClient from '../client';
import { LoginFormData, RegistrationFormData, TwoFactorData } from '@/lib/validations/auth';
import { getFingerprint } from '@/lib/utils/fingerprint';

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
    const response = await apiClient.post('/auth/register', {
      ...data,
      fingerprint: getFingerprint(),
    });
    return response.data;
  },

  // Login with email/password
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', {
      email: data.email,
      password: data.password,
      fingerprint: getFingerprint(),
    });
    return response.data;
  },

  // Google OAuth login
  googleAuth: async (token: string, fingerprint?: string): Promise<AuthResponse> => {
    // Note: Google endpoint might not natively expect fingerprint in some implementations
    // but our backend handler for google might not be checking it yet. 
    // However, if we added session creation there, we likely need it.
    // Let's check backend handler... YES, it uses fingerprint from somewhere. 
    // Wait, backend GoogleAuth does: fingerprint := c.Get("X-Fingerprint", "unknown")
    // It doesn't read from body. 
    // BUT Login reads from Body.
    // Let's send it in body AND header to be safe if I can, but here I can only control body easily.
    // Actually, let's send in body too if backend supports it, or rely on header if I update client.
    // My previous analysis said backend GoogleAuth reads from HEADER X-Fingerprint.
    // But Login reads from BODY.
    // I should update GoogleAuth in backend to read from Body too if I want consistency?
    // User asked me to fix WEB app.
    // So for Google Auth, I should ensure X-Fingerprint header is sent? 
    // Or maybe just send it in body and hope backend reads it?
    // Backend GoogleAuth code:
    // fingerprint := c.Get("X-Fingerprint", "unknown")
    // It DOES NOT read from body.
    // So for GoogleAuth, I MUST send header or update backend. 
    // I'll update client to send X-Fingerprint header globally?
    // That would cover everything.
    // But Login/Register expect it in BODY.
    // So I should do BOTH.
    // Let's stick to Body for Login/Register as defined in struct.
    // For GoogleAuth, I will pass it as a custom header config in the post request.

    // Actually, looking at client.ts, I can add an interceptor to ALWAYS add X-Fingerprint header?
    // That would be cleanest for "unknown" cases.
    // But Login/Register explicitly bind to JSON body.

    const response = await apiClient.post('/auth/google', {
      token,
    }, {
      headers: {
        'X-Fingerprint': getFingerprint()
      }
    });
    return response.data;
  },

  // Verify 2FA code
  verify2FA: async (data: TwoFactorData & { email: string }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-2fa', {
      ...data,
      fingerprint: getFingerprint()
    });
    return response.data;
  },

  // Get current user
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await apiClient.post('/auth/logout', {
      refresh_token: refreshToken,
      fingerprint: getFingerprint()
    });
    return response.data;
  },

  // Refresh token
  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
      fingerprint: getFingerprint(),
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, data: any) => {
    const response = await apiClient.post(`/auth/reset-password?token=${token}`, {
      ...data,
      fingerprint: getFingerprint()
    });
    return response.data;
  },
};

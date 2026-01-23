import api from './client';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authAPI = {
  // Google OAuth login
  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/google', { token });
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
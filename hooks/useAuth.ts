/**
 * Authentication Store (Zustand)
 * Manages global authentication state
 */

import { create } from 'zustand';
import { User } from '@/types';
import apiClient from '@/services/api-client';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post('/auth/login', { email, password });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      const { token, user } = response.data as { token: string; user: User };

      apiClient.setToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.post('/auth/register', { username, email, password });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      const { token, user } = response.data as { token: string; user: User };

      apiClient.setToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    apiClient.removeToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const token = apiClient.getToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await apiClient.get('/auth/me');

      if (!response.success || !response.data) {
        throw new Error('Auth check failed');
      }

      set({
        user: response.data as User,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      apiClient.removeToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

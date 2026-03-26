/**
 * Video Store (Zustand)
 * Manages videos, search, and related video state
 */

import { create } from 'zustand';
import { Video, TrendingResponse } from '@/types';
import apiClient from '@/services/api-client';

interface VideoFilters {
  sort?: 'date' | 'views' | 'rating';
  duration?: 'short' | 'medium' | 'long';
  uploadDate?: 'today' | 'week' | 'month' | 'year';
}

interface VideoStore {
  videos: Video[];
  trendingVideos: Video[];
  searchResults: Video[];
  relatedVideos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
  error: string | null;
  cursor: string | null;

  // Actions
  fetchVideos: (filters?: VideoFilters) => Promise<void>;
  fetchTrendingVideos: () => Promise<void>;
  loadMoreTrendingVideos: () => Promise<void>;
  searchVideos: (query: string) => Promise<void>;
  fetchRelatedVideos: (videoId: string) => Promise<void>;
  setCurrentVideo: (video: Video) => void;
  clearError: () => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  trendingVideos: [],
  searchResults: [],
  relatedVideos: [],
  currentVideo: null,
  isLoading: false,
  error: null,
  cursor: null,

  fetchVideos: async (filters) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<Video[]>('/videos', { params: filters });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch videos');
      }

      set({
        videos: (response.data as Video[]) || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchTrendingVideos: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<TrendingResponse>('/videos/trending');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch trending videos');
      }

      const data = response.data as TrendingResponse;
      set({
        trendingVideos: data?.videos || [],
        cursor: data?.cursor || null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  loadMoreTrendingVideos: async () => {
    try {
      const currentCursor = get().cursor;
      
      if (!currentCursor) {
        set({ error: 'No more videos available' });
        return;
      }

      set({ isLoading: true, error: null });

      const response = await apiClient.get<TrendingResponse>('/videos/trending', {
        params: { cursor: currentCursor },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to load more videos');
      }

      const data = response.data as TrendingResponse;
      const newVideos = data?.videos || [];
      const currentVideos = get().trendingVideos;

      set({
        trendingVideos: [...currentVideos, ...newVideos],
        cursor: data?.cursor || null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  searchVideos: async (query) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<Video[]>('/videos/search', {
        params: { q: query },
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to search videos');
      }

      set({
        searchResults: (response.data as Video[]) || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchRelatedVideos: async (videoId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<Video[]>(`/videos/${videoId}/related`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch related videos');
      }

      set({
        relatedVideos: (response.data as Video[]) || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  setCurrentVideo: (video) => {
    set({ currentVideo: video });
  },

  clearError: () => {
    set({ error: null });
  },
}));

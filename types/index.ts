// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  subscriberCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Video types
export interface Video {
  _id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelId: string;
  channelName: string;
  channelAvatar?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  uploadDate: Date;
  duration?: number;
  category?: string;
  isHD?: boolean;
}

// Comment types
export interface Comment {
  _id: string;
  videoId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Like/Dislike types
export interface Like {
  _id: string;
  userId: string;
  videoId: string;
  type: 'like' | 'dislike';
  createdAt: Date;
}

// Watch History types
export interface WatchHistory {
  _id: string;
  userId: string;
  videoId: string;
  watchedAt: Date;
  duration: number;
  progress: number;
}

// Channel types
export interface Channel {
  _id: string;
  channelId: string;
  name: string;
  description: string;
  avatar: string;
  banner?: string;
  subscriber_count: number;
  video_count: number;
  verified: boolean;
  createdAt: Date;
}

// Search Results types
export interface SearchResult {
  type: 'video' | 'channel' | 'playlist';
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

// Auth Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Trending Videos Response type
export interface TrendingResponse {
  videos: Video[];
  cursor: string | null;
  hasMore: boolean;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

// Notification types
export interface Notification {
  _id: string;
  userId: string;
  type: 'like' | 'comment' | 'subscription' | 'reply';
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

// Theme types
export type Theme = 'light' | 'dark';

// Filter types
export interface VideoFilters {
  sort?: 'date' | 'views' | 'rating';
  duration?: 'short' | 'medium' | 'long';
  uploadDate?: 'today' | 'week' | 'month' | 'year';
  type?: 'video' | 'channel' | 'playlist';
}

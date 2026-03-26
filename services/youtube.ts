/**
 * YouTube RapidAPI Service
 * Handles all YouTube API calls via RapidAPI
 */

import axios, { AxiosError } from 'axios';
import { SearchResult, Video } from '@/types';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;

const api = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
    'Content-Type': 'application/json',
  },
});

/**
 * Search videos on YouTube
 */
export async function searchVideos(
  query: string,
  options: { cursor?: string; hl?: string; gl?: string } = {}
) {
  try {
    const params: any = {
      q: query,
      hl: options.hl || 'en',
      gl: options.gl || 'US',
    };

    if (options.cursor) {
      params.cursor = options.cursor;
    }

    const response = await api.get('/search/', { params });

    return {
      success: true,
      data: response.data.contents || response.data || [],
      cursor: response.data.cursor || null,
    };
  } catch (error) {
    console.error('YouTube search API failed:', error);
    throw new Error('Failed to search videos');
  }
}

/**
 * Get videos from a channel
 */
export async function getChannelVideos(
  channelId: string,
  options: { cursor?: string; filter?: string; hl?: string; gl?: string } = {}
) {
  try {
    const params: any = {
      id: channelId,
      filter: options.filter || 'videos_latest',
      hl: options.hl || 'en',
      gl: options.gl || 'US',
    };

    if (options.cursor) {
      params.cursor = options.cursor;
    }

    const response = await api.get('/channel/videos/', { params });

    return {
      success: true,
      data: response.data.contents || response.data || [],
      cursor: response.data.cursor || null,
    };
  } catch (error) {
    console.error('YouTube channel videos error:', error);
    throw new Error('Failed to fetch channel videos');
  }
}

/**
 * Get trending videos
 */
export async function getTrendingVideos(options: { region?: string; hl?: string; gl?: string; cursor?: string } = {}) {
  try {
    const params: any = {};
    
    // Only add parameters if they're provided
    if (options.hl) params.hl = options.hl;
    if (options.gl) params.gl = options.gl;
    if (options.region) params.region_code = options.region;
    if (options.cursor) params.cursor = options.cursor;

    const response = await api.get('/v2/trending', Object.keys(params).length > 0 ? { params } : {});

    return {
      success: true,
      data: response.data.contents || response.data.list || response.data || [],
      cursor: response.data.cursor || null,
    };
  } catch (error: any) {
    console.error('YouTube trending API failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw new Error('Failed to fetch trending videos');
  }
}

/**
 * Get related videos for a video
 */
export async function getRelatedVideos(videoId: string) {
  try {
    const response = await api.get('/video/related-contents/', {
      params: {
        id: videoId,
        hl: 'en',
        gl: 'US',
      },
    });

    return {
      success: true,
      data: response.data.contents || response.data || [],
    };
  } catch (error) {
    console.error('YouTube related videos error:', error);
    throw new Error('Failed to fetch related videos');
  }
}

/**
 * Get video details
 */
export async function getVideoDetails(videoId: string) {
  try {
    const response = await api.get('/video/details/', {
      params: {
        id: videoId,
        hl: 'en',
        gl: 'US',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('YouTube video details error:', error);
    throw new Error('Failed to fetch video details');
  }
}

/**
 * Get channel details
 */
export async function getChannelDetails(channelId: string) {
  try {
    const response = await api.get('/channel/details/', {
      params: {
        id: channelId,
        hl: 'en',
        gl: 'US',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('YouTube channel details error:', error);
    throw new Error('Failed to fetch channel details');
  }
}

/**
 * Format API response to Video interface
 */
let videoIdCounter = 0;

export function formatVideoResponse(item: any): Video {
  // Generate a fallback ID if video_id is missing
  // Handle both snake_case and camelCase
  const videoIdFromApi = item.videoId || item.video_id || item.id || '';
  
  // Use a counter along with timestamp to ensure uniqueness
  if (!videoIdFromApi) {
    videoIdCounter++;
  }
  
  const fallbackId = videoIdFromApi || `video-${Date.now()}-${videoIdCounter}`;
  
  return {
    _id: fallbackId,
    videoId: videoIdFromApi || fallbackId,
    title: item.title || item.video_title || '',
    description: item.description || item.video_description || '',
    thumbnail: item.thumbnail || item.video_thumbnail_url || item.videoThumbnails?.[0]?.url || '',
    channelId: item.channel_id || item.channelId || item.authorId || '',
    channelName: item.channel_title || item.channelName || item.author || '',
    channelAvatar: item.channel_avatar || item.channelAvatar || item.authorThumbnails?.[0]?.url || '',
    viewCount: parseInt(item.video_views_count || item.viewCount || 0) || 0,
    likeCount: parseInt(item.video_like_count || item.likeCount || 0) || 0,
    commentCount: parseInt(item.video_comment_count || item.commentCount || 0) || 0,
    uploadDate: new Date(item.video_publish_date || item.publishedAt || item.published || new Date()),
    duration: item.video_duration || item.duration || item.lengthSeconds || 0,
    category: item.category || 'General',
    isHD: item.isHD || false,
  };
}

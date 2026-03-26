/**
 * Trending Videos API Route
 * GET /api/videos/trending
 */

import { NextRequest } from 'next/server';
import { getTrendingVideos, formatVideoResponse } from '@/services/youtube';
import { successResponse, handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const hl = searchParams.get('hl');
    const gl = searchParams.get('gl');
    const cursor = searchParams.get('cursor');

    // Call YouTube API without default params - let service decide
    const result = await getTrendingVideos({ 
      region: region || undefined,
      hl: hl || undefined,
      gl: gl || undefined,
      cursor: cursor || undefined,
    });

    // Format response - handle both array and object responses
    let videos: any[] = [];
    
    if (Array.isArray(result.data)) {
      videos = result.data;
    } else if (result.data && typeof result.data === 'object') {
      // Try various common response structures
      if (result.data.list && Array.isArray(result.data.list)) {
        videos = result.data.list;
      } else if (result.data.contents && Array.isArray(result.data.contents)) {
        videos = result.data.contents;
      } else if (result.data.videos && Array.isArray(result.data.videos)) {
        videos = result.data.videos;
      } else if (result.data.items && Array.isArray(result.data.items)) {
        videos = result.data.items;
      } else if (result.data.data && Array.isArray(result.data.data)) {
        videos = result.data.data;
      }
    }
    
    // Filter for video items only
    let filtered = (Array.isArray(videos) ? videos : [])
      .filter((item: any) => item.type === 'video' || item.video_type === 'video' || !item.type);
    
    // If no videos found after filtering, use all items
    if (filtered.length === 0 && Array.isArray(videos) && videos.length > 0) {
      filtered = videos;
    }
    
    const formattedVideos = filtered
      .map((item: any) => {
        try {
          return formatVideoResponse(item);
        } catch (e) {
          console.error('Error formatting video item:', e);
          return null;
        }
      })
      .filter((v: any) => v !== null);

    return successResponse(
      {
        videos: formattedVideos,
        cursor: result.cursor || null,
        hasMore: result.cursor !== null && result.cursor !== undefined,
      },
      'Trending videos fetched'
    );
  } catch (error: any) {
    console.error('Trending API error:', {
      message: error.message,
      stack: error.stack,
    });
    return handleApiError(error, 500);
  }
}

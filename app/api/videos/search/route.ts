/**
 * Search Videos API Route
 * GET /api/videos/search?q=query
 */

import { NextRequest } from 'next/server';
import { searchVideos, formatVideoResponse } from '@/services/youtube';
import { successResponse, validationError, handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const cursor = searchParams.get('cursor') || undefined;
    const hl = searchParams.get('hl') || 'en';
    const gl = searchParams.get('gl') || 'US';

    // Validation
    if (!query || query.trim().length === 0) {
      return validationError('Search query is required');
    }

    // Call YouTube API
    const result = await searchVideos(query, { cursor, hl, gl });

    // Format response - handle both array and object responses
    let videos = Array.isArray(result.data) ? result.data : result.data.contents || [];
    
    const formattedVideos = videos
      .filter(
        (item: any) =>
          item.type === 'video' || item.video_type === 'video'
      )
      .map(formatVideoResponse);

    return successResponse(
      formattedVideos,
      'Videos found'
    );
  } catch (error) {
    return handleApiError(error, 500);
  }
}

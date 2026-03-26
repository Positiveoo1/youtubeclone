/**
 * Related Videos API Route
 * GET /api/videos/[videoId]/related
 */

import { NextRequest } from 'next/server';
import { getRelatedVideos, formatVideoResponse } from '@/services/youtube';
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const { videoId } = params;

    if (!videoId) {
      return validationError('Video ID is required');
    }

    // Call YouTube API
    const result = await getRelatedVideos(videoId);

    if (!result.success || !result.data) {
      return notFoundError('Related videos not found');
    }

    // Format response
    const formattedVideos = result.data
      .filter((item: any) => item.type === 'video' || item.video_type === 'video')
      .map(formatVideoResponse)
      .slice(0, 30);

    return successResponse(formattedVideos, 'Related videos fetched');
  } catch (error) {
    return handleApiError(error, 500);
  }
}

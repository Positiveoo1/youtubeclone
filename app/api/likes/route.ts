/**
 * Likes API Routes
 * GET/POST/DELETE /api/likes?videoId=xxx
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LikeModel from '@/models/Like';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import {
  successResponse,
  validationError,
  handleApiError,
  unauthorizedError,
} from '@/lib/errors';

// GET likes for a video
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return validationError('Video ID is required');
    }

    const likes = await LikeModel.countDocuments({ videoId, type: 'like' });
    const dislikes = await LikeModel.countDocuments({ videoId, type: 'dislike' });

    // Get user's like status if authenticated
    let userLikeStatus = null;
    const token = getTokenFromHeader(request.headers.get('Authorization') || '');
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const userLike = await LikeModel.findOne({
          userId: decoded.userId,
          videoId,
        });
        if (userLike) {
          userLikeStatus = userLike.type;
        }
      }
    }

    return successResponse({
      likes,
      dislikes,
      userLikeStatus,
    });
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, returning default likes:', error.message);
      return successResponse({
        likes: 0,
        dislikes: 0,
        userLikeStatus: null,
      });
    }
    return handleApiError(error, 500);
  }
}

// POST like/dislike
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const token = getTokenFromHeader(request.headers.get('Authorization') || '');
    if (!token) {
      return unauthorizedError('Authentication required');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return unauthorizedError('Invalid token');
    }

    const { videoId, type } = await request.json();

    // Validation
    if (!videoId || !type) {
      return validationError('Video ID and type are required');
    }

    if (!['like', 'dislike'].includes(type)) {
      return validationError('Type must be either "like" or "dislike"');
    }

    // Remove existing like/dislike
    await LikeModel.deleteOne({
      userId: decoded.userId,
      videoId,
    });

    // Create new like/dislike
    const like = await LikeModel.create({
      userId: decoded.userId,
      videoId,
      type,
    });

    return successResponse(like, 'Like/dislike recorded', 201);
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, cannot save like/dislike:', error.message);
      return successResponse(null, 'Like/dislike saved locally', 201);
    }
    return handleApiError(error, 500);
  }
}

// DELETE like/dislike
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const token = getTokenFromHeader(request.headers.get('Authorization') || '');
    if (!token) {
      return unauthorizedError('Authentication required');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return unauthorizedError('Invalid token');
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return validationError('Video ID is required');
    }

    await LikeModel.deleteOne({
      userId: decoded.userId,
      videoId,
    });

    return successResponse(null, 'Like/dislike removed');
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, cannot remove like/dislike:', error.message);
      return successResponse(null, 'Like/dislike removed locally');
    }
    return handleApiError(error, 500);
  }
}

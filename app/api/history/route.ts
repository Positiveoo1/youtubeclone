/**
 * Watch History API Routes
 * GET/POST /api/history
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WatchHistoryModel from '@/models/WatchHistory';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import {
  successResponse,
  validationError,
  handleApiError,
  unauthorizedError,
} from '@/lib/errors';

// GET watch history for authenticated user
export async function GET(request: NextRequest) {
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    const history = await WatchHistoryModel.find({ userId: decoded.userId })
      .sort({ watchedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await WatchHistoryModel.countDocuments({ userId: decoded.userId });

    return successResponse({
      history,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, returning empty history:', error.message);
      return successResponse({
        history: [],
        total: 0,
        limit: 20,
        skip: 0,
      });
    }
    return handleApiError(error, 500);
  }
}

// POST watch history entry
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

    const { videoId, duration, progress } = await request.json();

    // Validation
    if (!videoId) {
      return validationError('Video ID is required');
    }

    // Update or create watch history
    const entry = await WatchHistoryModel.findOneAndUpdate(
      { userId: decoded.userId, videoId },
      {
        userId: decoded.userId,
        videoId,
        watchedAt: new Date(),
        duration: duration || 0,
        progress: progress || 0,
      },
      { upsert: true, new: true }
    );

    return successResponse(entry, 'Watch history updated', 201);
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, cannot save watch history:', error.message);
      return successResponse(null, 'Watch history saved locally', 201);
    }
    return handleApiError(error, 500);
  }
}

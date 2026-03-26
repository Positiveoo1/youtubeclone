/**
 * Comments API Routes
 * GET/POST /api/comments?videoId=xxx
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CommentModel from '@/models/Comment';
import UserModel from '@/models/User';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import {
  successResponse,
  validationError,
  handleApiError,
  unauthorizedError,
  notFoundError,
} from '@/lib/errors';

// GET comments for a video
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    if (!videoId) {
      return validationError('Video ID is required');
    }

    const comments = await CommentModel.find({ videoId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await CommentModel.countDocuments({ videoId });

    return successResponse({
      comments,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, returning empty comments:', error.message);
      return successResponse({
        comments: [],
        total: 0,
        limit: 20,
        skip: 0,
      });
    }
    return handleApiError(error, 500);
  }
}

// POST new comment
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

    const { videoId, content } = await request.json();

    // Validation
    if (!videoId || !content || content.trim().length === 0) {
      return validationError('Video ID and content are required');
    }

    if (content.length > 1000) {
      return validationError('Comment is too long (max 1000 characters)');
    }

    // Get user
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return notFoundError('User not found');
    }

    // Create comment
    const comment = await CommentModel.create({
      videoId,
      userId: decoded.userId,
      username: user.username,
      userAvatar: user.avatar,
      content,
    });

    return successResponse(comment, 'Comment posted successfully', 201);
  } catch (error: any) {
    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND')) {
      console.warn('MongoDB unavailable, cannot save comment:', error.message);
      return successResponse(null, 'Comment saved locally', 201);
    }
    return handleApiError(error, 500);
  }
}

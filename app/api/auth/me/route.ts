/**
 * Get Current User API Route
 * GET /api/auth/me
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { successResponse, unauthorizedError, handleApiError, notFoundError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from header
    const token = getTokenFromHeader(request.headers.get('Authorization') || '');

    if (!token) {
      return unauthorizedError('No authorization token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return unauthorizedError('Invalid or expired token');
    }

    // Get user from database
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return notFoundError('User not found');
    }

    // Return user data
    return successResponse({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      verified: user.verified,
      subscriberCount: user.subscriberCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return handleApiError(error, 500);
  }
}

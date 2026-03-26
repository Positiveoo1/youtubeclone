/**
 * Login API Route
 * POST /api/auth/login
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, validationError, handleApiError, unauthorizedError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return validationError('Missing required fields', {
        email: !email ? 'Email is required' : undefined,
        password: !password ? 'Password is required' : undefined,
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return unauthorizedError('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return unauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    // Return response
    return successResponse(
      {
        token,
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          verified: user.verified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      'Login successful'
    );
  } catch (error: any) {
    // Check if it's a MongoDB connection error
    if (error.message?.includes('querySrv') || error.message?.includes('ENOTFOUND') || error.message?.includes('connect')) {
      console.error('Database connection error:', error.message);
      return {
        status: 503,
        json: () => Promise.resolve({
          success: false,
          error: 'Database connection failed. Please check your MongoDB configuration in .env.local',
          details: 'Unable to connect to MongoDB. Make sure: 1) MONGODB_URI is set correctly, 2) Your IP is whitelisted in MongoDB Atlas, 3) Network has internet access'
        })
      };
    }
    return handleApiError(error, 500);
  }
}

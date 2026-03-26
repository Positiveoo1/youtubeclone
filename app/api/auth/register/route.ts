/**
 * Register API Route
 * POST /api/auth/register
 */

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { hashPassword, validatePasswordStrength } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, validationError, handleApiError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return validationError('Missing required fields', {
        username: !username ? 'Username is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        password: !password ? 'Password is required' : undefined,
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return validationError('Password does not meet requirements', {
        password: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return validationError('User already exists', {
        email: existingUser.email === email ? 'Email already registered' : undefined,
        username: existingUser.username === username ? 'Username already taken' : undefined,
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username,
    });

    // Return response
    return successResponse(
      {
        token,
        user: {
          _id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
      'User registered successfully',
      201
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

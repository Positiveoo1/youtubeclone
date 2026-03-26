/**
 * Middleware for authentication
 * Protects API routes that require authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

/**
 * Middleware to verify JWT token
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    try {
      // Get token from header
      const token = getTokenFromHeader(request.headers.get('Authorization') || '');

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'No authorization token provided' },
          { status: 401 }
        );
      }

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Attach user to request
      (request as any).user = decoded;

      // Call the actual handler
      return handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

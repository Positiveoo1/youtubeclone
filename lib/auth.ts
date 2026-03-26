/**
 * JWT Authentication Utilities
 * Handles token generation, verification, and decoding
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT Token
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET as string, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verify JWT Token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Decode Token (without verification)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as JwtPayload;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

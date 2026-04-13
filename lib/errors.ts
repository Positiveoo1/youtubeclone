/**
 * Error Handling Utilities
 */

import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors and return consistent response
 */
export function handleApiError(error: any, statusCode: number = 500) {
  console.error('API Error:', error);

  let message = 'An unexpected error occurred';
  let details = null;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const response: ApiResponse<null> = {
    success: false,
    error: message,
  };

  if (details && process.env.NODE_ENV === 'development') {
    response.message = JSON.stringify(details);
  }

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Validation error response
 */
export function validationError(message: string, errors: any = {}) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: errors,
    },
    { status: 400 }
  );
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(message: string = 'Unauthorized') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

/**
 * Forbidden error response
 */
export function forbiddenError(message: string = 'Forbidden') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

/**
 * Not found error response
 */
export function notFoundError(message: string = 'Resource not found') {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 404 }
  );
}

/**
 * Server error response
 */
export function serverError(message: string = 'Internal server error', details?: string) {
  const response: any = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status: 503 });
}

/**
 * Success response
 */
export function successResponse<T>(data: T, message: string = 'Success', status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

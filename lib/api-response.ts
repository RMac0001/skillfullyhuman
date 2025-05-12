// File: lib/api-response.ts
// Helper functions for consistent API responses

import { ApiResponse } from '@/types';

// Create a successful response
export function success<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

// Create an error response
export function error(message: string, statusCode = 400): ApiResponse<null> {
  return {
    success: false,
    error: message,
    message,
  };
}

// Create a paginated response
export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}> {
  const pages = Math.ceil(total / limit);

  return {
    success: true,
    data: {
      items,
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
    message: 'Success',
  };
}

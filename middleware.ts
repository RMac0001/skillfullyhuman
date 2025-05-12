// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
import { UserRole } from './types/user';

// Define the structure of our JWT token including the role
interface ExtendedJWT extends JWT {
  id?: string;
  role?: UserRole;
}

/**
 * Middleware to protect admin routes and handle authentication redirects
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  // Get the token from the request and cast to our extended type
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as ExtendedJWT | null;

  const { pathname } = req.nextUrl;

  // Allow requests if:
  // 1. The token exists
  // 2. It's a request for next-auth session & provider
  // 3. It's the login page or error page
  if (
    token ||
    pathname.includes('/api/auth') ||
    pathname === '/admin/login' ||
    pathname === '/admin/error'
  ) {
    // If on login page and already logged in, redirect to dashboard
    if (pathname === '/admin/login' && token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Check if token has admin role for admin routes
    if (pathname.startsWith('/admin') && token && token.role !== 'admin') {
      // User is logged in but not an admin, redirect to access denied
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    return NextResponse.next();
  }

  // Otherwise, redirect to login page
  if (!token && pathname.startsWith('/admin')) {
    // Store the original URL to redirect back after login
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Configure which routes use this middleware
 */
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Optional: Add other protected routes here
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractTokenFromHeader, verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  // Skip OPTIONS requests
  if (request.method === 'OPTIONS') {
    return NextResponse.next();
  }

  // Only apply middleware to /api/protected routes
  if (!request.nextUrl.pathname.startsWith('/api/protected')) {
    return NextResponse.next();
  }

  // Get the Authorization header
  const authHeader = request.headers.get('authorization');
  
  // Extract token from header
  const token = extractTokenFromHeader(authHeader || '');
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication token is missing' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Verify the token
  const payload = await verifyToken(token);
  
  if (!payload) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Add user info to request headers for route handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);
  if (payload.role) {
    requestHeaders.set('x-user-role', payload.role);
  }

  // Continue with the modified request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/protected/:path*',
};
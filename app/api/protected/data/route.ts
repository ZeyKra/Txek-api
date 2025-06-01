import { NextRequest, NextResponse } from 'next/server';
import { StringRecordId } from 'surrealdb';

export async function GET(request: NextRequest) {
  // The middleware has already verified the JWT token
  // and added user information to the request headers
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userRole = request.headers.get('x-user-role');

  // Example protected data
  const data = {
    message: 'This is protected data',
    timestamp: new Date().toISOString(),
    user: {
      id: userId,
      email: userEmail,
      role: userRole
    }
  };

  return NextResponse.json(data);
}

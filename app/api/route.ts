import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Next.js API with Auth.js and SurrealDB',
    version: '1.0.0',
    description: 'Backend-only API with JWT authentication',
    endpoints: {
      auth: '/api/auth/token',
      protected: '/api/protected/*',
      health: '/api/health'
    }
  });
}
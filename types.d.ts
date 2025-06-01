// SurrealDB User Type
export interface User {
  id: string;
  email: string;
  password: string; // Hashed password
  name?: string;
  role?: string;
  emailVerified?: Date;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// JWT Payload Type
export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
  [key: string]: any;
}

// Auth Response Type
export interface AuthResponse {
  token: string;
}

// Error Response Type
export interface ErrorResponse {
  error: string;
  status?: number;
}

// Protected Data Response Type
export interface ProtectedDataResponse {
  message: string;
  timestamp: string;
  user: {
    id: string | null;
    email: string | null;
    role: string | null;
  };
}

// Health Check Response Type
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
}
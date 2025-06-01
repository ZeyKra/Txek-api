# Next.js API with Auth.js and SurrealDB

This is a backend-only API project built with Next.js (App Router), Auth.js v5.0.0, and SurrealDB. It provides JWT-based authentication for protected API routes.

## Features

- Next.js App Router with TypeScript
- Auth.js v5.0.0 integration
- SurrealDB database integration
- JWT-based authentication
- Protected API routes
- Middleware for route protection

## Prerequisites

- Node.js 18.x or later
- SurrealDB installed and running

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables in the `.env` file:

```
# Auth.js Configuration
AUTH_SECRET=your-auth-secret-key-here
AUTH_URL=http://localhost:3000

# SurrealDB Configuration
SURREALDB_URL=http://localhost:8000
SURREALDB_NAMESPACE=test
SURREALDB_DATABASE=test
SURREALDB_USERNAME=root
SURREALDB_PASSWORD=root

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRATION=86400 # 24 hours in seconds
```

### 4. Start SurrealDB

Start SurrealDB with the following command:

```bash
surreal start --log debug --user root --pass root memory
```

### 5. Run the development server

```bash
npm run dev
```

The API will be available at http://localhost:3000.

## API Endpoints

### Authentication

- **POST /api/auth/token**
  - Request body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "token": "jwt-token-here" }`

### Protected Routes

- **GET /api/protected/data**
  - Headers: `Authorization: Bearer <jwt-token>`
  - Response: Protected data

### Health Check

- **GET /api/health**
  - Response: `{ "status": "ok", "timestamp": "2023-06-01T12:00:00.000Z", "version": "1.0.0" }`

## Adding Users to SurrealDB

To add a user to the database, you can use the SurrealDB CLI or any SurrealDB client. Here's an example using the SurrealDB CLI:

```sql
CREATE user:user1 CONTENT {
  email: "user@example.com",
  password: crypto::argon2::generate("password123"),
  name: "Test User",
  role: "user"
};
```

## Authentication Flow

1. Client sends credentials to `/api/auth/token`
2. Server validates credentials against SurrealDB
3. If valid, server generates a JWT and returns it
4. Client includes the JWT in the `Authorization` header for protected routes
5. Middleware validates the JWT for all routes under `/api/protected/*`

## License

MIT

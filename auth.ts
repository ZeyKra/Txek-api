import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateUserCredentials } from './lib/db';
import { generateToken } from './lib/jwt';
import { SurrealDBAdapter } from './lib/surreal-adapter';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SurrealDBAdapter(),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await validateUserCredentials(credentials.email.toString(), credentials.password.toString());
          
          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/api/auth/signin',
    error: '/api/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.AUTH_SECRET
});

// Extend the next-auth types
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
  }

  interface Session {
    user: User;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    role?: string;
  }
}
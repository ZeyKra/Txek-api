import type { Adapter } from '@auth/core/adapters';
import { connectToDatabase } from './db';

export function SurrealDBAdapter(): Adapter {
  return {
    async createUser(user) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'CREATE user CONTENT $data RETURN id, name, email, emailVerified, image',
        { data: user }
      );
      return result.result[0];
    },

    async getUser(id) {
      const db = await connectToDatabase();
      const [result] = await db.query('SELECT * FROM user WHERE id = $id', { id });
      return result?.result?.[0] || null;
    },

    async getUserByEmail(email) {
      const db = await connectToDatabase();
      const [result] = await db.query('SELECT * FROM user WHERE email = $email', { email });
      return result?.result?.[0] || null;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'SELECT user.* FROM account WHERE provider = $provider AND providerAccountId = $providerAccountId FETCH user',
        { provider, providerAccountId }
      );
      return result?.result?.[0]?.user || null;
    },

    async updateUser(user) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'UPDATE user:$id MERGE $data RETURN id, name, email, emailVerified, image',
        { id: user.id, data: user }
      );
      return result.result[0];
    },

    async deleteUser(userId) {
      const db = await connectToDatabase();
      await db.query('DELETE user:$id', { id: userId });
      return null;
    },

    async linkAccount(account) {
      const db = await connectToDatabase();
      await db.query(
        'CREATE account CONTENT $data',
        { data: { ...account, user: account.userId } }
      );
      return account;
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const db = await connectToDatabase();
      await db.query(
        'DELETE account WHERE provider = $provider AND providerAccountId = $providerAccountId',
        { provider, providerAccountId }
      );
      return;
    },

    async createSession(session) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'CREATE session CONTENT $data RETURN id, sessionToken, userId, expires',
        { data: session }
      );
      return result.result[0];
    },

    async getSessionAndUser(sessionToken) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'SELECT *, user FROM session WHERE sessionToken = $sessionToken FETCH user',
        { sessionToken }
      );
      
      const session = result?.result?.[0];
      if (!session) return null;
      
      const user = session.user;
      if (!user) return null;
      
      return {
        session: {
          id: session.id,
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image
        }
      };
    },

    async updateSession(session) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'UPDATE session:$id MERGE $data RETURN id, sessionToken, userId, expires',
        { id: session.id, data: session }
      );
      return result.result[0];
    },

    async deleteSession(sessionToken) {
      const db = await connectToDatabase();
      await db.query('DELETE session WHERE sessionToken = $sessionToken', { sessionToken });
      return null;
    },

    async createVerificationToken(verificationToken) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'CREATE verification_token CONTENT $data RETURN identifier, token, expires',
        { data: verificationToken }
      );
      return result.result[0];
    },

    async useVerificationToken({ identifier, token }) {
      const db = await connectToDatabase();
      const [result] = await db.query(
        'SELECT * FROM verification_token WHERE identifier = $identifier AND token = $token',
        { identifier, token }
      );
      
      if (!result?.result?.[0]) return null;
      
      await db.query(
        'DELETE verification_token WHERE identifier = $identifier AND token = $token',
        { identifier, token }
      );
      
      return result.result[0];
    }
  };
}
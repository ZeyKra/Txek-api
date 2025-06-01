import { SurrealResponse } from '@/types/surreal-response';
import Surreal from 'surrealdb';

let db: Surreal | null = null;

export async function connectToDatabase() {
  if (db) return db;

  try {
    db = new Surreal();
    
    await db.connect(process.env.SURREALDB_URL || 'http://localhost:8000');
    await db.signin({
      username: process.env.SURREALDB_USERNAME || 'root',
      password: process.env.SURREALDB_PASSWORD || 'root',
    });
    
    await db.use({
      namespace: process.env.SURREALDB_NAMESPACE || 'test',
      database: process.env.SURREALDB_AUTH_DATABASE || 'test',
    });
    
    console.log('Connected to SurrealDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to SurrealDB:', error);
    throw error;
  }
}

export async function getUser(email: string) {
  const db = await connectToDatabase();

  try {
    const userInformations: SurrealResponse<any> = await db.query('SELECT * FROM user WHERE email = $email LIMIT 1', { email });
    return userInformations[0][0]; 
  } catch(error) {
    console.error("Failed to get user informations:", error)
    throw new Error("Failed to get user informations")
  }

}

export async function validateUserCredentials(email: string, password: string) {
  const db = await connectToDatabase();

  try {
      const userInformations: SurrealResponse<any> = await db.query(`SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1`, { email, password })
      //db.close();
      return userInformations[0][0]
  } catch(error) {
      console.error("Failed to get user informations:", error)
      throw new Error("Failed to get user informations")
  } 
}
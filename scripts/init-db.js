// This script initializes the SurrealDB database with a test user
// Run with: node scripts/init-db.js
require('dotenv').config();

const { default: Surreal } = require('surrealdb');

async function initializeDatabase() {
  console.log('Initializing SurrealDB database...');
  
  const db = new Surreal();
  
  try {
    // Connect to the database
    await db.connect(process.env.SURREALDB_URL);
    
    await db.signin({
      username: process.env.SURREALDB_USERNAME,
      password: process.env.SURREALDB_PASSWORD,
    });

    await db.use({
      namespace: process.env.SURREALDB_NAMESPACE,
      database: process.env.SURREALDB_DATABASE,
    });
    
    console.log('Connected to SurrealDB');
    
    // Create a test user
    const createUserQuery = `
      CREATE user:test_user CONTENT {
        email: "test@example.com",
        password: crypto::argon2::generate("password123"),
        name: "Test User",
        role: "user"
      };
    `;
    
    const result = await db.query(createUserQuery);
    console.log('Created test user:', result);
    
    console.log('\nTest User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    console.log('\nDatabase initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
  //Close the connection
    await db.close();
  }
}

initializeDatabase();
// File: lib/db/mongo.ts
import { MongoClient, Db, MongoClientOptions, Document } from 'mongodb';

// Global variable to cache the database connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connects to MongoDB and returns the database instance.
 * Uses connection pooling through a cached connection.
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI || !process.env.MONGODB_NAME) {
    throw new Error('MongoDB connection string or database name not provided');
  }

  const options: MongoClientOptions = {
    maxPoolSize: 10,
    minPoolSize: 1,
  };

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, options);
    const db = client.db(process.env.MONGODB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

/**
 * Get a reference to a specific collection with type safety
 */
export async function getCollection<T extends Document = Document>(
  collectionName: string,
) {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Gracefully close database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

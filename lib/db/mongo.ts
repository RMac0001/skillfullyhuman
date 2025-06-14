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
 * Enhanced health check for MongoDB with detailed metrics
 */
export async function checkMongoHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  details?: Record<string, any>;
}> {
  try {
    const { db } = await connectToDatabase();

    // Basic ping test
    await db.command({ ping: 1 });

    // Get detailed metrics (with fallbacks if they fail)
    let serverStatus, dbStats;

    try {
      serverStatus = await db.command({ serverStatus: 1 });
    } catch (error) {
      console.warn('Could not get MongoDB server status:', error);
    }

    try {
      dbStats = await db.command({ dbStats: 1 });
    } catch (error) {
      console.warn('Could not get MongoDB database stats:', error);
    }

    return {
      status: 'healthy' as const,
      message: 'MongoDB is connected and responding',
      details: {
        version: serverStatus?.version || 'unknown',
        uptime: serverStatus?.uptime || 0,
        connections: serverStatus?.connections?.current || 0,
        dbSize: dbStats
          ? Math.round((dbStats.dataSize / (1024 * 1024)) * 100) / 100
          : 0, // MB
        collections: dbStats?.collections || 0,
        memoryUsage: serverStatus?.mem
          ? {
              resident:
                Math.round((serverStatus.mem.resident || 0) * 100) / 100, // MB
              virtual: Math.round((serverStatus.mem.virtual || 0) * 100) / 100, // MB
            }
          : undefined,
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy' as const,
      message: `MongoDB health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
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

// scripts/cleanup-database.ts
// Description: Removes old and unused data from the database
// Args: days

import { MongoClient, Db } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

interface CleanupResult {
  collection: string;
  deletedCount: number;
}

interface CleanupSummary {
  totalDeleted: number;
  collections: CleanupResult[];
}

/**
 * Cleans up old data from the specified collections
 * @param db The MongoDB database instance
 * @param cutoffDate The date before which records should be deleted
 * @param collections Array of collection names to clean up
 * @returns A summary of cleanup results
 */
async function cleanupCollections(
  db: Db,
  cutoffDate: Date,
  collections: string[],
): Promise<CleanupSummary> {
  const results: CleanupResult[] = [];
  let totalDeleted = 0;

  for (const collection of collections) {
    try {
      // Check if collection exists
      const collectionExists = await db
        .listCollections({ name: collection })
        .hasNext();

      if (collectionExists) {
        // Delete old records
        const result = await db.collection(collection).deleteMany({
          createdAt: { $lt: cutoffDate },
        });

        results.push({
          collection,
          deletedCount: result.deletedCount || 0,
        });

        totalDeleted += result.deletedCount || 0;

        console.log(
          `Cleaned up ${result.deletedCount} documents from ${collection}`,
        );
      } else {
        console.log(`Collection ${collection} does not exist, skipping...`);
      }
    } catch (error) {
      console.error(`Error cleaning up collection ${collection}:`, error);
      results.push({
        collection,
        deletedCount: 0,
      });
    }
  }

  return {
    totalDeleted,
    collections: results,
  };
}

/**
 * Cleans up expired sessions
 * @param db The MongoDB database instance
 * @returns Number of deleted sessions
 */
async function cleanupExpiredSessions(db: Db): Promise<number> {
  try {
    // Check if sessions collection exists
    const collectionExists = await db
      .listCollections({ name: 'sessions' })
      .hasNext();

    if (collectionExists) {
      const result = await db.collection('sessions').deleteMany({
        expires: { $lt: new Date() },
      });

      console.log(`Removed ${result.deletedCount} expired sessions`);
      return result.deletedCount || 0;
    } else {
      console.log('Sessions collection does not exist, skipping...');
      return 0;
    }
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
    return 0;
  }
}

async function main(): Promise<void> {
  // Get days argument from command line or use default (30 days)
  const args = process.argv.slice(2);
  const days = args.length > 0 ? parseInt(args[0]) : 30;

  if (isNaN(days) || days <= 0) {
    console.error('Invalid days parameter. Must be a positive number.');
    process.exit(1);
  }

  console.log(`Cleaning up data older than ${days} days...`);

  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Get MongoDB URI from environment variables
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!mongoUri || !dbName) {
    console.error(
      'MongoDB connection details not found in environment variables',
    );
    process.exit(1);
  }

  let client: MongoClient | null = null;

  try {
    // Connect to MongoDB
    client = await MongoClient.connect(mongoUri);
    const db = client.db(dbName);

    console.log('Connected to database');

    // Collections to clean up (add more as needed)
    const collectionsToCleanup = [
      'logs',
      'activity',
      'notifications',
      'temporary_data',
    ];

    // Perform cleanup operations
    const cleanupResults = await cleanupCollections(
      db,
      cutoffDate,
      collectionsToCleanup,
    );
    const sessionsDeleted = await cleanupExpiredSessions(db);

    // Print summary
    console.log('\nCleanup Summary:');
    console.log('=====================================');
    console.log(
      `Total documents deleted: ${cleanupResults.totalDeleted + sessionsDeleted}`,
    );
    console.log('- By collection:');

    cleanupResults.collections.forEach(result => {
      console.log(`  • ${result.collection}: ${result.deletedCount} documents`);
    });

    console.log(`  • sessions: ${sessionsDeleted} documents`);
    console.log('=====================================');

    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

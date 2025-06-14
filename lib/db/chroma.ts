// File: lib/db/chroma.ts
import { ChromaClient } from 'chromadb';

/**
 * Get ChromaDB client - simple and direct
 */
export const getChromaClient = () => {
  // For production, you would specify the host and port
  // e.g., new ChromaClient({ path: 'http://localhost:8000' })
  // For development, the default settings work with in-memory DB
  const clientOptions = process.env.CHROMADB_HOST
    ? {
        path: `http://${process.env.CHROMADB_HOST}:${process.env.CHROMADB_PORT || 8000}`,
      }
    : {};

  return new ChromaClient(clientOptions);
};

/**
 * Get or create a collection - simple wrapper
 */
export const getOrCreateCollection = async (collectionName: string) => {
  const client = getChromaClient();

  try {
    return await client.getOrCreateCollection({
      name: collectionName,
      metadata: {
        description: `Collection for ${collectionName}`,
      },
    });
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Enhanced health check for ChromaDB with detailed metrics
 */
export async function checkChromaHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  details?: Record<string, any>;
}> {
  try {
    const client = getChromaClient();

    // Test basic connection and get version
    const version = await client.version();

    // Get detailed metrics (with fallbacks if they fail)
    let collections: string[] = [];
    let totalEmbeddings = 0;
    const collectionDetails: Record<string, number> = {};

    try {
      collections = await client.listCollections();

      // Count embeddings in each collection
      for (const collectionName of collections) {
        try {
          const collection = await client.getCollection({
            name: collectionName,
          });
          const count = await collection.count();
          collectionDetails[collectionName] = count;
          totalEmbeddings += count;
        } catch (error) {
          console.warn(
            `Could not get count for collection ${collectionName}:`,
            error,
          );
          collectionDetails[collectionName] = -1; // Indicate error
        }
      }
    } catch (error) {
      console.warn('Could not get ChromaDB collections:', error);
    }

    return {
      status: 'healthy' as const,
      message: 'ChromaDB is responding',
      details: {
        version,
        totalCollections: collections.length,
        totalEmbeddings,
        collections: collectionDetails,
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy' as const,
      message: `ChromaDB health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// lib/chroma/client.ts
import { ChromaClient } from 'chromadb';

// Configure ChromaDB client
export const getChromaClient = () => {
  // For production, you would specify the host and port
  // e.g., new ChromaClient({ host: 'localhost', port: 8000 })
  // For development, the default settings work with in-memory DB
  return new ChromaClient();
};

// Initialize a collection
export const getOrCreateCollection = async (collectionName: string) => {
  const client = getChromaClient();

  try {
    return await client.getOrCreateCollection({
      name: collectionName,
      metadata: {
        description: `Collection for ${collectionName}`
      }
    });
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error;
  }
};
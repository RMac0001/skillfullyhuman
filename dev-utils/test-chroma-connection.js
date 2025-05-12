// dev-utils/test-chroma.ts
import { getChromaClient, getOrCreateCollection } from '@lib/chroma/client';

async function testChroma() {
  try {
    const client = getChromaClient();
    console.log('ChromaDB client initialized');

    const collections = await client.listCollections();
    console.log('Existing collections:', collections);
  } catch (error) {
    console.error('ChromaDB test failed:', error);
  }
}

testChroma();

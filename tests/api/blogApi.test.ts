// File: tests/api/blogApi.test.ts

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase } from '@/lib/db/mongo'; // Native Mongo driver
import { MongoClient, Db } from 'mongodb';

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: Db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.MONGODB_DB = 'testdb';

  const result = await connectToDatabase();
  db = result.db;
  client = result.client;
});

afterEach(async () => {
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('Blog API', () => {
  it('should connect to test DB', async () => {
    const collections = await db.collections();
    expect(Array.isArray(collections)).toBe(true);
  });

  // Add more tests here as needed
});

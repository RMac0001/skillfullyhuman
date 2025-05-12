// app/api/status/mongo/route.ts
import { MongoClient } from 'mongodb';

export async function GET() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    return Response.json({ status: ' online ' });
  } catch {
    return Response.json({ status: ' offline ' });
  } finally {
    await client.close();
  }
}
// app/api/status/chroma/route.ts
import { getChromaClient, getOrCreateCollection } from '@lib/db/chroma';
export async function GET() {
  try {
    const client = getChromaClient();
    return Response.json({ status: ' online ' });
  } catch (error) {
    return Response.json({ status: ' offline ' });
  }
}

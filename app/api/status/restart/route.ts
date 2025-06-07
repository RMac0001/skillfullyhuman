// app/api/status/restart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const serviceMap: Record<string, string> = {
  mongo: 'Start MongoDB',
  chroma: 'Start ChromaDB'
};

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const { service } = await request.json();
  const taskName = serviceMap[service];

  if (!taskName) {
    return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
  }

  try {
    await execAsync(`schtasks /run /tn "${taskName}"`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

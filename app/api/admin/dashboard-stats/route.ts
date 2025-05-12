// app/api/admin/dashboard-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDatabase } from '../../../../lib/db/mongo';
import fs from 'fs';
import path from 'path';

// Define types for dashboard statistics
type ServerHealth = 'healthy' | 'warning' | 'error' | 'loading';

interface DashboardStats {
  serverHealth: ServerHealth;
  databaseSize: number;
  totalCollections: number;
  scriptsAvailable: number;
}

interface ErrorResponse {
  error: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Get server health (simplified)
    let serverHealth: ServerHealth = 'healthy';

    // Get database size
    const dbStats = await db.command({ dbStats: 1 });
    const databaseSize =
      Math.round((dbStats.dataSize / (1024 * 1024)) * 100) / 100; // Convert to MB

    // Get ChromaDB collections count (simplified mock)
    // In a real app, you would use the ChromaDB client
    let totalCollections = 0;
    try {
      const response = await fetch('http://localhost:8000/api/v1/collections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        totalCollections = Array.isArray(data) ? data.length : 0;
      }
    } catch (error) {
      console.error('Error getting ChromaDB collections:', error);
      serverHealth = 'warning';
    }

    // Count available scripts
    let scriptsAvailable = 0;
    try {
      const scriptsDir = path.join(process.cwd(), 'scripts');
      if (fs.existsSync(scriptsDir)) {
        const files = fs.readdirSync(scriptsDir);
        scriptsAvailable = files.filter(
          file =>
            file.endsWith('.js') ||
            file.endsWith('.ps1') ||
            file.endsWith('.ts'),
        ).length;
      }
    } catch (error) {
      console.error('Error counting scripts:', error);
    }

    const dashboardStats: DashboardStats = {
      serverHealth,
      databaseSize,
      totalCollections,
      scriptsAvailable,
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Error in dashboard stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 },
    );
  }
}

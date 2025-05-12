// app/api/admin/server-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db/mongo';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execPromise = promisify(exec);

// Define types for the server status data
type StatusType = 'healthy' | 'warning' | 'error' | 'loading';

interface ServerMetrics {
  uptime?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  version?: string;
  connections?: number;
  dbSize?: number;
  collections?: number;
  totalEmbeddings?: number;
}

interface ServerStatusItem {
  status: StatusType;
  message: string;
  metrics: ServerMetrics;
}

interface ServerStatusData {
  webServer: ServerStatusItem;
  mongodb: ServerStatusItem;
  chromadb: ServerStatusItem;
}

// Helper function to check if a service is running
async function checkServiceStatus(
  serviceName: string,
  checkCommand: string,
): Promise<{ status: StatusType; message: string }> {
  try {
    await execPromise(checkCommand);
    return {
      status: 'healthy',
      message: `${serviceName} is running normally`,
    };
  } catch (error) {
    console.error(`Error checking ${serviceName} status:`, error);
    return {
      status: 'error',
      message: `Unable to connect to ${serviceName}: ${(error as Error).message}`,
    };
  }
}

// Get MongoDB metrics
async function getMongoDBMetrics(db: any): Promise<ServerMetrics> {
  try {
    // Get server stats
    const serverStatus = await db.command({ serverStatus: 1 });

    // Get database stats
    const dbStats = await db.command({ dbStats: 1 });

    return {
      version: serverStatus.version,
      connections: serverStatus.connections.current,
      dbSize: dbStats.dataSize / (1024 * 1024), // Convert to MB
      uptime: serverStatus.uptime,
    };
  } catch (error) {
    console.error('Error getting MongoDB metrics:', error);
    return {};
  }
}

// Get ChromaDB metrics
async function getChromaDBMetrics(): Promise<ServerMetrics> {
  try {
    const response = await fetch('http://localhost:8000/api/v1/collections', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ChromaDB API error: ${response.status}`);
    }

    const data = await response.json();

    let totalEmbeddings = 0;

    if (Array.isArray(data)) {
      for (const collection of data) {
        totalEmbeddings += collection.count || 0;
      }
    }

    return {
      version: 'latest',
      collections: Array.isArray(data) ? data.length : 0,
      totalEmbeddings,
    };
  } catch (error) {
    console.error('Error getting ChromaDB metrics:', error);
    return {};
  }
}

// Get system metrics for the web server
function getSystemMetrics(): ServerMetrics {
  try {
    const uptime = process.uptime();

    // Memory usage
    const memUsage = process.memoryUsage();
    const memoryUsage = memUsage.rss / (1024 * 1024); // Convert to MB

    // CPU usage (simplified)
    const cpuUsage = os.loadavg()[0]; // 1-minute load average

    return {
      uptime,
      memoryUsage,
      cpuUsage,
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return {}; // Return empty object to satisfy return type
  }
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

    // Check web server status (it's running if we got here)
    const webServerStatus: ServerStatusItem = {
      status: 'healthy',
      message: 'Web server is running normally',
      metrics: getSystemMetrics(),
    };

    // Check MongoDB status
    let mongodbStatus: ServerStatusItem;
    try {
      await db.command({ ping: 1 });
      mongodbStatus = {
        status: 'healthy',
        message: 'MongoDB is connected and responding',
        metrics: await getMongoDBMetrics(db),
      };
    } catch (error) {
      mongodbStatus = {
        status: 'error',
        message: `Unable to connect to MongoDB: ${(error as Error).message}`,
        metrics: {},
      };
    }

    // Check ChromaDB status
    let chromadbStatus: ServerStatusItem;
    try {
      // Simple connection check
      const response = await fetch('http://localhost:8000/api/v1/heartbeat', {
        method: 'GET',
      });

      if (response.ok) {
        chromadbStatus = {
          status: 'healthy',
          message: 'ChromaDB is connected and responding',
          metrics: await getChromaDBMetrics(),
        };
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error) {
      chromadbStatus = {
        status: 'error',
        message: `Unable to connect to ChromaDB: ${(error as Error).message}`,
        metrics: {},
      };
    }

    // Return all statuses
    const serverStatus: ServerStatusData = {
      webServer: webServerStatus,
      mongodb: mongodbStatus,
      chromadb: chromadbStatus,
    };

    return NextResponse.json(serverStatus);
  } catch (error) {
    console.error('Error in server status API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server status' },
      { status: 500 },
    );
  }
}

// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongo'; // Use path alias or adjust path as needed

// Define types for health check response
type HealthStatus = 'healthy' | 'warning' | 'error';

interface ServiceHealth {
  status: HealthStatus;
  details?: Record<string, any>;
}

interface HealthCheckResponse {
  status: HealthStatus;
  environment: string;
  version: string;
  timestamp: string;
  services: {
    web: ServiceHealth;
    mongodb: ServiceHealth;
    chromadb: ServiceHealth;
  };
}

interface ErrorResponse {
  status: 'error';
  environment: string;
  version: string;
  timestamp: string;
  error: string;
}

/**
 * Check MongoDB connection health
 */
async function checkMongoDBHealth(): Promise<ServiceHealth> {
  try {
    const { db } = await connectToDatabase();

    // Ping MongoDB to verify connection
    await db.command({ ping: 1 });

    // Get some basic stats
    const serverStatus = await db.command({ serverStatus: 1 });

    return {
      status: 'healthy',
      details: {
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        connections: serverStatus.connections.current,
      },
    };
  } catch (error) {
    console.error('MongoDB health check failed:', error);
    return {
      status: 'error',
      details: {
        message: (error as Error).message,
      },
    };
  }
}

/**
 * Check ChromaDB connection health
 */
async function checkChromaDBHealth(): Promise<ServiceHealth> {
  try {
    // Try to connect to ChromaDB heartbeat endpoint
    const response = await fetch('http://localhost:8000/api/v1/heartbeat', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to avoid hanging
      signal: AbortSignal.timeout(2000), // 2-second timeout
    });

    if (!response.ok) {
      throw new Error(`ChromaDB returned status: ${response.status}`);
    }

    // Get collections to add detail
    const collectionsResponse = await fetch(
      'http://localhost:8000/api/v1/collections',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    let collections: any[] = [];
    if (collectionsResponse.ok) {
      collections = await collectionsResponse.json();
    }

    return {
      status: 'healthy',
      details: {
        collectionCount: Array.isArray(collections) ? collections.length : 0,
      },
    };
  } catch (error) {
    console.error('ChromaDB health check failed:', error);
    return {
      status: 'error',
      details: {
        message: (error as Error).message,
      },
    };
  }
}

/**
 * Health check API endpoint
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const environment = process.env.NODE_ENV || 'development';
  const version = process.env.APP_VERSION || '1.0.0';
  const timestamp = new Date().toISOString();

  try {
    // Run health checks in parallel for efficiency
    const [mongodbHealth, chromadbHealth] = await Promise.all([
      checkMongoDBHealth(),
      checkChromaDBHealth(),
    ]);

    // Web server is healthy if we're responding
    const webHealth: ServiceHealth = {
      status: 'healthy',
      details: {
        uptime: process.uptime(),
      },
    };

    // Determine overall system health based on service health
    let overallStatus: HealthStatus = 'healthy';

    if (mongodbHealth.status === 'error' || chromadbHealth.status === 'error') {
      overallStatus = 'error';
    } else if (
      mongodbHealth.status === 'warning' ||
      chromadbHealth.status === 'warning'
    ) {
      overallStatus = 'warning';
    }

    const healthResponse: HealthCheckResponse = {
      status: overallStatus,
      environment,
      version,
      timestamp,
      services: {
        web: webHealth,
        mongodb: mongodbHealth,
        chromadb: chromadbHealth,
      },
    };

    // Set appropriate cache headers to prevent caching
    return NextResponse.json(healthResponse, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Health check error:', error);

    const errorResponse: ErrorResponse = {
      status: 'error',
      environment,
      version,
      timestamp,
      error: (error as Error).message,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkMongoHealth } from '@/lib/db/mongo';
import { checkChromaHealth } from '@/lib/db/chroma';

// Define types for health check response
type HealthStatus = 'healthy' | 'warning' | 'error';

interface ServiceHealth {
  status: HealthStatus;
  message: string;
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
 * Health check API endpoint
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const environment = process.env.NODE_ENV || 'development';
  const version = process.env.APP_VERSION || '1.0.0';
  const timestamp = new Date().toISOString();

  try {
    // Run health checks in parallel for efficiency
    const [mongodbHealth, chromadbHealth] = await Promise.all([
      checkMongoHealth(),
      checkChromaHealth(),
    ]);

    // Web server is healthy if we're responding
    const webHealth: ServiceHealth = {
      status: 'healthy',
      message: 'Web server is running normally',
      details: {
        uptime: process.uptime(),
        memory: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024), // MB
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
        },
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
      },
    };

    // Convert health check results to our format
    const mongoService: ServiceHealth = {
      status: mongodbHealth.status === 'healthy' ? 'healthy' : 'error',
      message: mongodbHealth.message,
      details: mongodbHealth.details,
    };

    const chromaService: ServiceHealth = {
      status: chromadbHealth.status === 'healthy' ? 'healthy' : 'error',
      message: chromadbHealth.message,
      details: chromadbHealth.details,
    };

    // Determine overall system health based on service health
    let overallStatus: HealthStatus = 'healthy';

    if (mongoService.status === 'error' || chromaService.status === 'error') {
      overallStatus = 'error';
    } else if (
      mongoService.status === 'warning' ||
      chromaService.status === 'warning'
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
        mongodb: mongoService,
        chromadb: chromaService,
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

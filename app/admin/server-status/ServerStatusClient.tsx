// app/admin/server-status/ServerStatusClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define types for the server status data
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
  status: 'healthy' | 'warning' | 'error' | 'loading';
  message: string;
  metrics: ServerMetrics;
}

interface ServerStatusData {
  webServer: ServerStatusItem;
  mongodb: ServerStatusItem;
  chromadb: ServerStatusItem;
}

export default function ServerStatusClient() {
  const { data: session, status } = useSession();
  const [serverStatus, setServerStatus] = useState<ServerStatusData>({
    webServer: { status: 'loading', message: '', metrics: {} },
    mongodb: { status: 'loading', message: '', metrics: {} },
    chromadb: { status: 'loading', message: '', metrics: {} },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/admin/server-status');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setServerStatus(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to fetch server status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStatus();

      // Set up polling
      const interval = setInterval(fetchStatus, 30000); // every 30 seconds

      return () => clearInterval(interval);
    }
  }, [status]);

  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-500';

    if (status === 'healthy') {
      bgColor = 'bg-green-500';
      textColor = 'text-green-800';
    } else if (status === 'warning') {
      bgColor = 'bg-yellow-500';
      textColor = 'text-yellow-800';
    } else if (status === 'error') {
      bgColor = 'bg-red-500';
      textColor = 'text-red-800';
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status === 'loading'
          ? 'Loading...'
          : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // The useEffect will handle the actual data fetching
  };

  return (
    <div>
      <div className="flex items-center justify-between py-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Server Status
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor the health and status of your server components.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        <div className="mt-4 border-l-4 border-red-400 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {lastUpdated && (
            <p className="mb-4 text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Web Server Status */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Web Server
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Next.js Application Server
                  </p>
                </div>
                <StatusIndicator status={serverStatus.webServer.status} />
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status Message
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.webServer.message || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Uptime
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.webServer.metrics.uptime
                        ? `${Math.floor(serverStatus.webServer.metrics.uptime / 3600)}h ${Math.floor((serverStatus.webServer.metrics.uptime % 3600) / 60)}m`
                        : 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Memory Usage
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.webServer.metrics.memoryUsage
                        ? `${Math.round(serverStatus.webServer.metrics.memoryUsage * 100) / 100} MB`
                        : 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      CPU Usage
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.webServer.metrics.cpuUsage
                        ? `${Math.round(serverStatus.webServer.metrics.cpuUsage * 100) / 100}%`
                        : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* MongoDB Status */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    MongoDB
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Database Server
                  </p>
                </div>
                <StatusIndicator status={serverStatus.mongodb.status} />
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status Message
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.mongodb.message || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.mongodb.metrics.version || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Connections
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.mongodb.metrics.connections || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Database Size
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.mongodb.metrics.dbSize
                        ? `${Math.round(serverStatus.mongodb.metrics.dbSize * 100) / 100} MB`
                        : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* ChromaDB Status */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    ChromaDB
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Vector Database
                  </p>
                </div>
                <StatusIndicator status={serverStatus.chromadb.status} />
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status Message
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.chromadb.message || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.chromadb.metrics.version || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Collections
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.chromadb.metrics.collections || 'N/A'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Embeddings
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {serverStatus.chromadb.metrics.totalEmbeddings || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

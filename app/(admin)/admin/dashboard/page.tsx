// app/(admin)/admin/server-status/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  Grid,
  Badge,
  Text,
  Title,
  Group,
  Stack,
  Button,
  Alert,
  Skeleton,
} from '@mantine/core';
import { IconRefresh, IconAlertCircle } from '@tabler/icons-react';

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

export default function ServerStatusPage() {
  const { data: session, status } = useSession();
  // Initialize as null to show loading skeleton first
  const [serverStatus, setServerStatus] = useState<ServerStatusData | null>(
    null,
  );
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

  // Get badge color based on status
  const getBadgeColor = (status: string) => {
    if (status === 'healthy') return 'lime';
    if (status === 'warning') return 'yellow';
    if (status === 'error') return 'var(--mantine-color-red-9)';
    return 'gray';
  };

  // Get badge text based on status
  const getBadgeText = (status: string) => {
    if (status === 'healthy') return 'ONLINE';
    if (status === 'warning') return 'WARNING';
    if (status === 'error') return 'OFFLINE';
    return 'CHECKING';
  };

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/server-status');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setServerStatus(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricItem = ({ label, value }: { label: string; value: string }) => (
    <Group justify="space-between">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {value}
      </Text>
    </Group>
  );

  const ServiceCard = ({
    title,
    subtitle,
    status,
    message,
    metrics,
  }: {
    title: string;
    subtitle: string;
    status: string;
    message: string;
    metrics: ServerMetrics;
  }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={4}>{title}</Title>
            <Text size="sm" c="dimmed">
              {subtitle}
            </Text>
          </div>
          <Badge color={getBadgeColor(status)} variant="filled" size="sm">
            {getBadgeText(status)}
          </Badge>
        </Group>

        <Stack gap="xs">
          <MetricItem label="Status" value={message || 'N/A'} />

          {title === 'Web Server' && (
            <>
              <MetricItem
                label="Uptime"
                value={
                  metrics.uptime
                    ? `${Math.floor(metrics.uptime / 3600)}h ${Math.floor((metrics.uptime % 3600) / 60)}m`
                    : 'N/A'
                }
              />
              <MetricItem
                label="Memory"
                value={
                  metrics.memoryUsage
                    ? `${Math.round(metrics.memoryUsage * 100) / 100} MB`
                    : 'N/A'
                }
              />
              <MetricItem
                label="CPU"
                value={
                  metrics.cpuUsage
                    ? `${Math.round(metrics.cpuUsage * 100) / 100}%`
                    : 'N/A'
                }
              />
            </>
          )}

          {title === 'MongoDB' && (
            <>
              <MetricItem
                label="Version"
                value={metrics.version || 'unknown'}
              />
              <MetricItem
                label="Connections"
                value={metrics.connections?.toString() || '0'}
              />
              <MetricItem
                label="DB Size"
                value={
                  metrics.dbSize !== undefined
                    ? `${Math.round(metrics.dbSize * 100) / 100} MB`
                    : '0 MB'
                }
              />
            </>
          )}

          {title === 'ChromaDB' && (
            <>
              <MetricItem
                label="Version"
                value={metrics.version || 'unknown'}
              />
              <MetricItem
                label="Collections"
                value={metrics.collections?.toString() || '0'}
              />
              <MetricItem
                label="Embeddings"
                value={metrics.totalEmbeddings?.toString() || '0'}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Card>
  );

  const LoadingCard = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={4}>{title}</Title>
            <Text size="sm" c="dimmed">
              {subtitle}
            </Text>
          </div>
          <Skeleton height={22} width={80} radius="xl" />
        </Group>

        <Stack gap="xs">
          {Array.from({ length: 4 }).map((_, index) => (
            <Group justify="space-between" key={index}>
              <Skeleton height={16} width={60} />
              <Skeleton height={16} width={40} />
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );

  // Show loading skeleton while data is being fetched
  if (isLoading && !serverStatus) {
    return (
      <Stack gap="xl" p="md">
        {/* Page Header */}
        <div>
          <Title order={1} mb="xs">
            Server Status
          </Title>
          <Text c="dimmed">
            Monitor the health and status of your server components
          </Text>
        </div>

        {/* Controls */}
        <Group justify="space-between" align="center">
          <Skeleton height={16} width={200} />
          <Skeleton height={36} width={100} />
        </Group>

        {/* Loading Cards Grid */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <LoadingCard
              title="Web Server"
              subtitle="Next.js Application Server"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <LoadingCard title="MongoDB" subtitle="Database Server" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <LoadingCard title="ChromaDB" subtitle="Vector Database" />
          </Grid.Col>
        </Grid>
      </Stack>
    );
  }

  return (
    <Stack gap="xl" p="md">
      {/* Page Header */}
      <div>
        <Title order={1} mb="xs">
          Server Status
        </Title>
        <Text c="dimmed">
          Monitor the health and status of your server components
        </Text>
      </div>

      {/* Error Display */}
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          variant="light"
        >
          Failed to load server status: {error}
        </Alert>
      )}

      {/* Controls */}
      <Group justify="space-between" align="center">
        {lastUpdated && (
          <Text size="sm" c="dimmed">
            Last updated: {lastUpdated.toLocaleString()}
          </Text>
        )}
        <Button
          variant="light"
          leftSection={<IconRefresh size="1rem" />}
          onClick={refreshStatus}
          loading={isLoading}
        >
          Refresh
        </Button>
      </Group>

      {/* Status Cards Grid */}
      {serverStatus && (
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <ServiceCard
              title="Web Server"
              subtitle="Next.js Application Server"
              status={serverStatus.webServer.status}
              message={serverStatus.webServer.message}
              metrics={serverStatus.webServer.metrics}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ServiceCard
              title="MongoDB"
              subtitle="Database Server"
              status={serverStatus.mongodb.status}
              message={serverStatus.mongodb.message}
              metrics={serverStatus.mongodb.metrics}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ServiceCard
              title="ChromaDB"
              subtitle="Vector Database"
              status={serverStatus.chromadb.status}
              message={serverStatus.chromadb.message}
              metrics={serverStatus.chromadb.metrics}
            />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  );
}

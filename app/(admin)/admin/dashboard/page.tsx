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

  // Get badge color based on status
  const getBadgeColor = (status: string) => {
    if (status === 'healthy') return 'lime';
    if (status === 'warning') return 'yellow';
    if (status === 'error') return 'var(--mantine-color-red-9)';
    return 'gray';
  };

  // Get badge text based on status
  const getBadgeText = (status: string) => {
    if (status === 'healthy') return 'Online';
    if (status === 'warning') return 'Warning';
    if (status === 'error') return 'Offline';
    return 'Loading...';
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
              <MetricItem label="Version" value={metrics.version || 'N/A'} />
              <MetricItem
                label="Connections"
                value={metrics.connections?.toString() || 'N/A'}
              />
              <MetricItem
                label="DB Size"
                value={
                  metrics.dbSize
                    ? `${Math.round(metrics.dbSize * 100) / 100} MB`
                    : 'N/A'
                }
              />
            </>
          )}

          {title === 'ChromaDB' && (
            <>
              <MetricItem label="Version" value={metrics.version || 'N/A'} />
              <MetricItem
                label="Collections"
                value={metrics.collections?.toString() || 'N/A'}
              />
              <MetricItem
                label="Embeddings"
                value={metrics.totalEmbeddings?.toString() || 'N/A'}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Card>
  );

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
    </Stack>
  );
}

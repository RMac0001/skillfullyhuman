// app/(admin)/admin/dashboard/page.tsx
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

// Define types for the health check data
interface ServiceDetails {
  version?: string;
  uptime?: number;
  connections?: number;
  dbSize?: number;
  collections?: number;
  totalCollections?: number;
  totalEmbeddings?: number;
  memory?: {
    rss?: number;
    heapUsed?: number;
    heapTotal?: number;
    resident?: number;
    virtual?: number;
  };
  nodeVersion?: string;
  platform?: string;
  arch?: string;
  pid?: number;
  error?: string;
}

interface ServiceHealth {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: ServiceDetails;
}

interface HealthCheckData {
  status: 'healthy' | 'warning' | 'error';
  environment: string;
  version: string;
  timestamp: string;
  services: {
    web: ServiceHealth;
    mongodb: ServiceHealth;
    chromadb: ServiceHealth;
  };
}

export default function ServerStatusPage() {
  const { data: session, status } = useSession();
  const [healthData, setHealthData] = useState<HealthCheckData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('/api/admin/health');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setHealthData(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to fetch health data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchHealthData();

      // Set up polling every 30 seconds
      const interval = setInterval(fetchHealthData, 30000);

      return () => clearInterval(interval);
    }
  }, [status]);

  // Get badge color based on status
  const getBadgeColor = (status: string) => {
    if (status === 'healthy') return 'green';
    if (status === 'warning') return 'yellow';
    if (status === 'error') return 'red';
    return 'gray';
  };

  // Get badge text based on status
  const getBadgeText = (status: string) => {
    if (status === 'healthy') return 'HEALTHY';
    if (status === 'warning') return 'WARNING';
    if (status === 'error') return 'ERROR';
    return 'UNKNOWN';
  };

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/health');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setHealthData(data);
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
    service,
  }: {
    title: string;
    subtitle: string;
    service: ServiceHealth;
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
          <Badge
            color={getBadgeColor(service.status)}
            variant="filled"
            size="sm"
          >
            {getBadgeText(service.status)}
          </Badge>
        </Group>

        <Stack gap="xs">
          <MetricItem label="Status" value={service.message || 'N/A'} />

          {title === 'Web Server' && service.details && (
            <>
              <MetricItem
                label="Uptime"
                value={
                  service.details.uptime
                    ? `${Math.floor(service.details.uptime / 3600)}h ${Math.floor((service.details.uptime % 3600) / 60)}m`
                    : 'N/A'
                }
              />
              <MetricItem
                label="Memory (RSS)"
                value={
                  service.details.memory?.rss
                    ? `${service.details.memory.rss} MB`
                    : 'N/A'
                }
              />
              <MetricItem
                label="Heap Used"
                value={
                  service.details.memory?.heapUsed
                    ? `${service.details.memory.heapUsed} MB`
                    : 'N/A'
                }
              />
              <MetricItem
                label="Node Version"
                value={service.details.nodeVersion || 'N/A'}
              />
              <MetricItem
                label="Platform"
                value={service.details.platform || 'N/A'}
              />
            </>
          )}

          {title === 'MongoDB' && service.details && (
            <>
              <MetricItem
                label="Version"
                value={service.details.version || 'unknown'}
              />
              <MetricItem
                label="Connections"
                value={service.details.connections?.toString() || '0'}
              />
              <MetricItem
                label="DB Size"
                value={
                  service.details.dbSize !== undefined
                    ? `${service.details.dbSize} MB`
                    : '0 MB'
                }
              />
              <MetricItem
                label="Collections"
                value={service.details.collections?.toString() || '0'}
              />
              {service.details.memory && (
                <>
                  <MetricItem
                    label="Memory (Resident)"
                    value={
                      service.details.memory.resident
                        ? `${service.details.memory.resident} MB`
                        : 'N/A'
                    }
                  />
                </>
              )}
            </>
          )}

          {title === 'ChromaDB' && service.details && (
            <>
              <MetricItem
                label="Version"
                value={service.details.version || 'unknown'}
              />
              <MetricItem
                label="Collections"
                value={service.details.totalCollections?.toString() || '0'}
              />
              <MetricItem
                label="Total Embeddings"
                value={service.details.totalEmbeddings?.toString() || '0'}
              />
            </>
          )}

          {service.status === 'error' && service.details?.error && (
            <Alert>
              <Text size="xs">{service.details.error}</Text>
            </Alert>
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
  if (isLoading && !healthData) {
    return (
      <Stack gap="xl" p="md">
        {/* Page Header */}
        <div>
          <Title order={1} mb="xs">
            System Health Dashboard
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
          System Health Dashboard
        </Title>
        <Text c="dimmed">
          Monitor the health and status of your server components
        </Text>
        {healthData && (
          <Group gap="xs" mt="xs">
            <Badge
              color={getBadgeColor(healthData.status)}
              variant="filled"
              size="lg"
            >
              System {getBadgeText(healthData.status)}
            </Badge>
            <Text size="sm" c="dimmed">
              Environment: {healthData.environment}
            </Text>
            <Text size="sm" c="dimmed">
              Version: {healthData.version}
            </Text>
          </Group>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          variant="light"
        >
          Failed to load health data: {error}
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
      {healthData && (
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <ServiceCard
              title="Web Server"
              subtitle="Next.js Application Server"
              service={healthData.services.web}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ServiceCard
              title="MongoDB"
              subtitle="Database Server"
              service={healthData.services.mongodb}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <ServiceCard
              title="ChromaDB"
              subtitle="Vector Database"
              service={healthData.services.chromadb}
            />
          </Grid.Col>
        </Grid>
      )}
    </Stack>
  );
}

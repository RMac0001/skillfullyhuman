'use client';

import React from 'react';
import {
  Card,
  Text,
  Title,
  Stack,
  SimpleGrid,
  Group,
  Badge,
  RingProgress,
  Progress,
  ThemeIcon,
  Grid,
  Paper,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconUsers,
  IconClick,
  IconDeviceAnalytics,
  IconChartBar,
  IconGlobe,
} from '@tabler/icons-react';

const metricsData = [
  {
    title: 'Page Views',
    value: '45,231',
    change: '+12.5%',
    trend: 'up',
    icon: IconEye,
    color: 'blue',
  },
  {
    title: 'Unique Visitors',
    value: '12,847',
    change: '+8.2%',
    trend: 'up',
    icon: IconUsers,
    color: 'green',
  },
  {
    title: 'Click Rate',
    value: '3.24%',
    change: '-0.8%',
    trend: 'down',
    icon: IconClick,
    color: 'orange',
  },
  {
    title: 'Bounce Rate',
    value: '34.2%',
    change: '-2.1%',
    trend: 'up',
    icon: IconDeviceAnalytics,
    color: 'violet',
  },
];

const trafficSources = [
  {
    source: 'Organic Search',
    percentage: 45,
    visitors: '5,782',
    color: 'blue',
  },
  { source: 'Direct', percentage: 25, visitors: '3,211', color: 'green' },
  {
    source: 'Social Media',
    percentage: 15,
    visitors: '1,926',
    color: 'orange',
  },
  { source: 'Email', percentage: 10, visitors: '1,285', color: 'violet' },
  { source: 'Referral', percentage: 5, visitors: '642', color: 'red' },
];

const topPages = [
  { page: '/dashboard', views: '8,432', percentage: 18.7 },
  { page: '/analytics', views: '6,218', percentage: 13.8 },
  { page: '/users', views: '4,156', percentage: 9.2 },
  { page: '/settings', views: '3,847', percentage: 8.5 },
  { page: '/reports', views: '2,945', percentage: 6.5 },
];

function MetricCard({ title, value, change, trend, icon: Icon, color }: any) {
  const TrendIcon = trend === 'up' ? IconTrendingUp : IconTrendingDown;
  const trendColor = trend === 'up' ? 'teal' : 'red';

  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} size={38} radius="md" variant="light">
          <Icon size={22} stroke={1.5} />
        </ThemeIcon>
      </Group>

      <Group mt="md">
        <Group gap={4}>
          <TrendIcon size={16} color={trendColor} />
          <Text size="sm" c={trendColor} fw={500}>
            {change}
          </Text>
        </Group>
        <Text size="sm" c="dimmed">
          vs last month
        </Text>
      </Group>
    </Card>
  );
}

export default function Analytics() {
  const metrics = metricsData.map(metric => (
    <MetricCard key={metric.title} {...metric} />
  ));

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Analytics Dashboard</Title>
          <Text c="dimmed" size="sm">
            Track your website performance and user engagement
          </Text>
        </div>
        <Badge variant="light" color="blue" size="lg">
          Last 30 days
        </Badge>
      </Group>

      {/* Metrics Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {metrics}
      </SimpleGrid>

      {/* Main Analytics Grid */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder padding="lg" radius="md" h={400}>
            <Group justify="space-between" mb="md">
              <div>
                <Text fw={500} size="lg">
                  Traffic Overview
                </Text>
                <Text size="sm" c="dimmed">
                  Daily visitors and page views
                </Text>
              </div>
              <ThemeIcon variant="light" color="blue">
                <IconChartBar size={20} />
              </ThemeIcon>
            </Group>

            <Paper
              h={300}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
              }}
            >
              <Stack align="center" gap="xs">
                <IconChartBar size={48} color="#adb5bd" />
                <Text c="dimmed" size="lg">
                  Traffic Chart Placeholder
                </Text>
                <Text c="dimmed" size="sm">
                  Connect your analytics service
                </Text>
              </Stack>
            </Paper>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg" radius="md" h={400}>
            <Group justify="space-between" mb="md">
              <Text fw={500} size="lg">
                Traffic Sources
              </Text>
              <ThemeIcon variant="light" color="green">
                <IconGlobe size={20} />
              </ThemeIcon>
            </Group>

            <Stack gap="md">
              <RingProgress
                size={120}
                thickness={8}
                sections={trafficSources.map(source => ({
                  value: source.percentage,
                  color: source.color,
                }))}
                label={
                  <Text size="xs" ta="center" fw={500}>
                    Total Sources
                  </Text>
                }
              />

              <Stack gap="xs">
                {trafficSources.map((source, index) => (
                  <Group key={index} justify="space-between">
                    <Group gap="xs">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: `var(--mantine-color-${source.color}-6)`,
                        }}
                      />
                      <Text size="sm">{source.source}</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      {source.visitors}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Top Pages */}
      <Card withBorder padding="lg" radius="md">
        <Text fw={500} size="lg" mb="md">
          Top Pages
        </Text>

        <Stack gap="sm">
          {topPages.map((page, index) => (
            <Group
              key={index}
              justify="space-between"
              p="sm"
              style={{
                borderRadius: '6px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'transparent',
              }}
            >
              <Group>
                <Text size="sm" fw={500} style={{ minWidth: 120 }}>
                  {page.page}
                </Text>
                <Progress
                  value={page.percentage}
                  size="sm"
                  style={{ width: 200 }}
                  color="blue"
                />
              </Group>
              <Group gap="lg">
                <Text size="sm" c="dimmed">
                  {page.percentage}%
                </Text>
                <Text size="sm" fw={500}>
                  {page.views} views
                </Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

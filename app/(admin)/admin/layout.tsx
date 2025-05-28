'use client';

import React, { useState } from 'react';

import {
  AppShell,
  Burger,
  Text,
  NavLink,
  Group,
  ActionIcon,
  Avatar,
  Menu,
  Stack,
  Badge,
} from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconSettings,
  IconChartBar,
  IconBell,
  IconLogout,
  IconUser,
  IconHome,
  IconChevronRight,
  IconPin,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navigationItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/admin/dashboard' },
  { label: 'Posts', icon: IconPin, href: '/admin/dashboard/posts' },
  {
    label: 'Analytics',
    icon: IconChartBar,
    href: '/admin/dashboard/analytics',
    badge: 'New',
  },
  { label: 'Users', icon: IconUsers, href: '/admin/dashboard/users' },
  { label: 'Settings', icon: IconSettings, href: '/admin/dashboard/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: { base: 200, sm: 250, lg: 280 },
        collapsed: { mobile: !opened },
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Header
        style={{
          backgroundColor: 'var(--mantine-color-white-smoke-9)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Burger
              opened={opened}
              onClick={() => setOpened(o => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <IconHome size={24} color="#0284c7" />
            <Text size="xl" fw={600} c="#0369a1">
              Dashboard
            </Text>
          </Group>

          <Group gap="md">
            <ActionIcon variant="light" color="gray" size="lg">
              <IconBell size={18} />
            </ActionIcon>

            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light" size="lg">
                  <Avatar size="sm" color="blue">
                    JD
                  </Avatar>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        className="admin-navbar"
        style={{
          backgroundColor: 'var(--mantine-color-white-smoke-9)',
          borderRight: '1px solid #e2e8f0',
        }}
        p="md"
      >
        <AppShell.Section grow>
          <Stack gap={4}>
            {navigationItems.map(item => (
              <NavLink
                key={item.label}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={16} stroke={1.5} />}
                rightSection={
                  item.badge ? (
                    <Badge size="xs" variant="filled" color="red">
                      {item.badge}
                    </Badge>
                  ) : (
                    <IconChevronRight size={12} stroke={1.5} />
                  )
                }
                active={pathname === item.href}
                onClick={() => setOpened(false)}
                style={{ borderRadius: 8, margin: '4px 8px' }}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Text size="xs" c="dimmed" ta="center">
            Version 1.0.0
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

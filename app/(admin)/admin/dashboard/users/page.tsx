'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Title,
  Stack,
  Group,
  Badge,
  Avatar,
  ActionIcon,
  TextInput,
  Select,
  Button,
  Table,
  Pagination,
  Menu,
  ThemeIcon,
  SimpleGrid,
  Alert,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconSearch,
  IconPlus,
  IconDots,
  IconEdit,
  IconTrash,
  IconMail,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconCrown,
  IconAlertCircle,
} from '@tabler/icons-react';

// Types for user data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar: string;
  joinDate: string;
}

interface UserStats {
  total: number;
  active: number;
  admins: number;
  recentSignups: number;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  // Load stats on mount
  useEffect(() => {
    fetchUserStats();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
        fetchUserStats(); // Refresh stats
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const statsData = userStats
    ? [
        {
          title: 'Total Users',
          value: userStats.total.toString(),
          icon: IconUsers,
          color: 'blue',
        },
        {
          title: 'Active Users',
          value: userStats.active.toString(),
          icon: IconUserCheck,
          color: 'green',
        },
        {
          title: 'Recent Signups',
          value: userStats.recentSignups.toString(),
          icon: IconUserX,
          color: 'orange',
        },
        {
          title: 'Admin Users',
          value: userStats.admins.toString(),
          icon: IconCrown,
          color: 'violet',
        },
      ]
    : [];

  const rows = users.map(user => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="blue" radius="xl">
            {user.avatar}
          </Avatar>
          <div>
            <Text fw={500}>{user.name}</Text>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={
            user.role === 'admin'
              ? 'red'
              : user.role === 'editor'
                ? 'blue'
                : 'gray'
          }
        >
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="dot"
          color={
            user.status === 'Active'
              ? 'green'
              : user.status === 'Inactive'
                ? 'red'
                : 'orange'
          }
        >
          {user.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{user.lastLogin}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{user.joinDate}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <ActionIcon variant="subtle" color="blue">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="green">
            <IconMail size={16} />
          </ActionIcon>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />}>
                Edit User
              </Menu.Item>
              <Menu.Item leftSection={<IconMail size={14} />}>
                Send Email
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => handleDelete(user.id)}
              >
                Delete User
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  if (loading && users.length === 0) {
    return (
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>User Management</Title>
            <Text c="dimmed" size="sm">
              Manage user accounts, roles, and permissions
            </Text>
          </div>
        </Group>
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Loading users...</Text>
          </Stack>
        </Center>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>User Management</Title>
          <Text c="dimmed" size="sm">
            Manage user accounts, roles, and permissions
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>Add User</Button>
      </Group>

      {/* Error Display */}
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          variant="light"
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      {/* User Stats */}
      {userStats && (
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
          {statsData.map(stat => (
            <Card key={stat.title} withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
                <ThemeIcon
                  color={stat.color}
                  size={38}
                  radius="md"
                  variant="light"
                >
                  <stat.icon size={22} stroke={1.5} />
                </ThemeIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Filters and Search */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            All Users
          </Text>
          <Text size="sm" c="dimmed">
            {pagination.total} users found
          </Text>
        </Group>

        <Group mb="lg">
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={event => setSearchTerm(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by role"
            data={['admin', 'user']}
            value={roleFilter}
            onChange={setRoleFilter}
            clearable
            style={{ width: 150 }}
          />
          <Select
            placeholder="Filter by status"
            data={['Active', 'Inactive', 'Pending']}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            style={{ width: 150 }}
          />
        </Group>

        {/* Users Table */}
        {loading ? (
          <Center p="xl">
            <Stack align="center" gap="md">
              <Loader />
              <Text>Loading users...</Text>
            </Stack>
          </Center>
        ) : users.length === 0 ? (
          <Center p="xl">
            <Stack align="center" gap="md">
              <IconUsers size={48} color="gray" />
              <Text size="lg" c="dimmed">
                No users found
              </Text>
              <Text size="sm" c="dimmed">
                {searchTerm || roleFilter || statusFilter
                  ? 'Try adjusting your search or filters'
                  : 'No users have been created yet'}
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Last Login</Table.Th>
                    <Table.Th>Join Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Group justify="center" mt="lg">
                <Pagination
                  value={currentPage}
                  onChange={setCurrentPage}
                  total={pagination.pages}
                  size="sm"
                />
              </Group>
            )}
          </>
        )}
      </Card>
    </Stack>
  );
}

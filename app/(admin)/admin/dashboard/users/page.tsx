'use client';

import React, { useState } from 'react';
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
} from '@tabler/icons-react';

const usersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2 hours ago',
    avatar: 'JD',
    joinDate: 'Jan 15, 2024',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '1 day ago',
    avatar: 'JS',
    joinDate: 'Mar 22, 2024',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '1 week ago',
    avatar: 'BJ',
    joinDate: 'Feb 8, 2024',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '3 hours ago',
    avatar: 'AB',
    joinDate: 'Apr 12, 2024',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'Editor',
    status: 'Pending',
    lastLogin: 'Never',
    avatar: 'CW',
    joinDate: 'May 3, 2024',
  },
  {
    id: 6,
    name: 'Diana Miller',
    email: 'diana.miller@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '5 minutes ago',
    avatar: 'DM',
    joinDate: 'Jan 28, 2024',
  },
];

const userStats = [
  {
    title: 'Total Users',
    value: '1,234',
    icon: IconUsers,
    color: 'blue',
  },
  {
    title: 'Active Users',
    value: '987',
    icon: IconUserCheck,
    color: 'green',
  },
  {
    title: 'Inactive Users',
    value: '247',
    icon: IconUserX,
    color: 'orange',
  },
  {
    title: 'Admin Users',
    value: '12',
    icon: IconCrown,
    color: 'violet',
  },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = usersData.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const rows = filteredUsers.map(user => (
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
            user.role === 'Admin'
              ? 'red'
              : user.role === 'Editor'
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
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Delete User
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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

      {/* User Stats */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
        {userStats.map(stat => (
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

      {/* Filters and Search */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">
            All Users
          </Text>
          <Text size="sm" c="dimmed">
            {filteredUsers.length} users found
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
            data={['Admin', 'Editor', 'User']}
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
        <Group justify="center" mt="lg">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={Math.ceil(filteredUsers.length / 10)}
            size="sm"
          />
        </Group>
      </Card>
    </Stack>
  );
}

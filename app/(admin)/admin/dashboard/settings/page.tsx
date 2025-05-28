'use client';

import React, { useState } from 'react';
import {
  Card,
  Text,
  Title,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Switch,
  Select,
  Divider,
  Avatar,
  ActionIcon,
  Tabs,
  PasswordInput,
  NumberInput,
  ColorInput,
  Slider,
  Badge,
  Alert,
} from '@mantine/core';
import {
  IconUser,
  IconSettings,
  IconShield,
  IconBell,
  IconPalette,
  IconDatabase,
  IconEdit,
  IconCheck,
  IconAlertCircle,
  IconUpload,
} from '@tabler/icons-react';

export default function Settings() {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer with 5+ years of experience.',
    company: 'Tech Corp',
    location: 'New York, NY',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    securityAlerts: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Settings</Title>
          <Text c="dimmed" size="sm">
            Manage your account preferences and system configuration
          </Text>
        </div>
      </Group>

      <Tabs defaultValue="profile" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="account" leftSection={<IconShield size={16} />}>
            Account & Security
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
            Appearance
          </Tabs.Tab>
          <Tabs.Tab value="system" leftSection={<IconDatabase size={16} />}>
            System
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Panel value="profile">
          <Stack gap="lg" mt="lg">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Profile Information
              </Text>

              <Group mb="lg">
                <Avatar size={80} color="blue">
                  JD
                </Avatar>
                <Stack gap="xs">
                  <Button
                    variant="outline"
                    size="sm"
                    leftSection={<IconUpload size={16} />}
                  >
                    Upload Photo
                  </Button>
                  <Text size="sm" c="dimmed">
                    JPG, PNG or GIF. Max size 5MB.
                  </Text>
                </Stack>
              </Group>

              <Stack gap="md">
                <Group grow>
                  <TextInput
                    label="Full Name"
                    value={profileData.name}
                    onChange={e =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                  <TextInput
                    label="Email"
                    value={profileData.email}
                    onChange={e =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </Group>

                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={e =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  rows={3}
                />

                <Group grow>
                  <TextInput
                    label="Company"
                    value={profileData.company}
                    onChange={e =>
                      setProfileData({
                        ...profileData,
                        company: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    label="Location"
                    value={profileData.location}
                    onChange={e =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                  />
                </Group>

                <Group justify="flex-end">
                  <Button variant="outline">Cancel</Button>
                  <Button leftSection={<IconCheck size={16} />}>
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Account & Security Tab */}
        <Tabs.Panel value="account">
          <Stack gap="lg" mt="lg">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Change Password
              </Text>

              <Stack gap="md">
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                />
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                />

                <Group justify="flex-end">
                  <Button>Update Password</Button>
                </Group>
              </Stack>
            </Card>

            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Two-Factor Authentication
              </Text>

              <Group justify="space-between" mb="md">
                <div>
                  <Text size="sm" fw={500}>
                    Enable 2FA
                  </Text>
                  <Text size="xs" c="dimmed">
                    Add an extra layer of security to your account
                  </Text>
                </div>
                <Switch size="md" />
              </Group>

              <Alert
                icon={<IconAlertCircle size={16} />}
                color="blue"
                variant="light"
              >
                Two-factor authentication is currently disabled. Enable it to
                secure your account.
              </Alert>
            </Card>

            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Login Sessions
              </Text>

              <Stack gap="sm">
                <Group
                  justify="space-between"
                  p="sm"
                  style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}
                >
                  <div>
                    <Text size="sm" fw={500}>
                      Current Session
                    </Text>
                    <Text size="xs" c="dimmed">
                      Chrome on Windows • New York, NY
                    </Text>
                  </div>
                  <Badge color="green" variant="light">
                    Active
                  </Badge>
                </Group>

                <Group justify="space-between" p="sm">
                  <div>
                    <Text size="sm" fw={500}>
                      Mobile App
                    </Text>
                    <Text size="xs" c="dimmed">
                      iPhone • Last active 2 hours ago
                    </Text>
                  </div>
                  <Button size="xs" variant="outline" color="red">
                    Revoke
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Notifications Tab */}
        <Tabs.Panel value="notifications">
          <Stack gap="lg" mt="lg">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Email Notifications
              </Text>

              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Email Notifications
                    </Text>
                    <Text size="xs" c="dimmed">
                      Receive email notifications
                    </Text>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onChange={e =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: e.currentTarget.checked,
                      })
                    }
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Weekly Report
                    </Text>
                    <Text size="xs" c="dimmed">
                      Get a weekly summary of your activity
                    </Text>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onChange={e =>
                      setNotifications({
                        ...notifications,
                        weeklyReport: e.currentTarget.checked,
                      })
                    }
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Security Alerts
                    </Text>
                    <Text size="xs" c="dimmed">
                      Important security notifications
                    </Text>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onChange={e =>
                      setNotifications({
                        ...notifications,
                        securityAlerts: e.currentTarget.checked,
                      })
                    }
                  />
                </Group>
              </Stack>
            </Card>

            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Push Notifications
              </Text>

              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>
                    Browser Notifications
                  </Text>
                  <Text size="xs" c="dimmed">
                    Show notifications in your browser
                  </Text>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onChange={e =>
                    setNotifications({
                      ...notifications,
                      pushNotifications: e.currentTarget.checked,
                    })
                  }
                />
              </Group>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Appearance Tab */}
        <Tabs.Panel value="appearance">
          <Stack gap="lg" mt="lg">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Theme Preferences
              </Text>

              <Stack gap="md">
                <Select
                  label="Theme"
                  data={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto (System)' },
                  ]}
                  value={systemSettings.theme}
                  onChange={value =>
                    setSystemSettings({
                      ...systemSettings,
                      theme: value || 'light',
                    })
                  }
                />

                <ColorInput
                  label="Primary Color"
                  defaultValue="#0ea5e9"
                  format="hex"
                />

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Font Size
                  </Text>
                  <Slider
                    defaultValue={14}
                    min={12}
                    max={18}
                    step={1}
                    marks={[
                      { value: 12, label: 'Small' },
                      { value: 14, label: 'Medium' },
                      { value: 16, label: 'Large' },
                      { value: 18, label: 'X-Large' },
                    ]}
                  />
                </div>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* System Tab */}
        <Tabs.Panel value="system">
          <Stack gap="lg" mt="lg">
            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Regional Settings
              </Text>

              <Stack gap="md">
                <Group grow>
                  <Select
                    label="Language"
                    data={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                    ]}
                    value={systemSettings.language}
                    onChange={value =>
                      setSystemSettings({
                        ...systemSettings,
                        language: value || 'en',
                      })
                    }
                  />

                  <Select
                    label="Timezone"
                    data={[
                      { value: 'America/New_York', label: 'Eastern Time' },
                      { value: 'America/Chicago', label: 'Central Time' },
                      { value: 'America/Denver', label: 'Mountain Time' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time' },
                    ]}
                    value={systemSettings.timezone}
                    onChange={value =>
                      setSystemSettings({
                        ...systemSettings,
                        timezone: value || 'America/New_York',
                      })
                    }
                  />
                </Group>

                <Select
                  label="Date Format"
                  data={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                  ]}
                  value={systemSettings.dateFormat}
                  onChange={value =>
                    setSystemSettings({
                      ...systemSettings,
                      dateFormat: value || 'MM/DD/YYYY',
                    })
                  }
                />
              </Stack>
            </Card>

            <Card withBorder padding="lg">
              <Text fw={500} size="lg" mb="md">
                Data Management
              </Text>

              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Export Data
                    </Text>
                    <Text size="xs" c="dimmed">
                      Download all your data
                    </Text>
                  </div>
                  <Button variant="outline">Export</Button>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500} c="red">
                      Delete Account
                    </Text>
                    <Text size="xs" c="dimmed">
                      Permanently delete your account and data
                    </Text>
                  </div>
                  <Button color="red" variant="outline">
                    Delete
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

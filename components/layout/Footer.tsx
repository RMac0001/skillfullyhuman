// components/layout/Footer.tsx
'use client';

import {
  Container,
  Group,
  Anchor,
  Text,
  Stack,
  SimpleGrid,
  Box,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from '@tabler/icons-react';
import classes from './Footer.module.css';

const data = [
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Opportunity Harvester', href: '/' },
      { label: 'Tech for Humans', href: '/' },
      { label: 'Writing Trainer', href: '/' },
      { label: 'Virtual coach', href: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const theme = useMantineTheme();

  const groups = data.map(group => {
    const links = group.links.map((link, index) => (
      <Anchor
        key={index}
        href={link.href}
        component="a"
        className={classes.link}
      >
        {link.label}
      </Anchor>
    ));

    return (
      <div key={group.title}>
        <Title order={5} mb="xs">
          {group.title}
        </Title>
        <Stack gap="xs">{links}</Stack>
      </div>
    );
  });

  return (
    <Box component="footer" className={classes.footer}>
      <Container className={classes.inner} size="xl">
        <div className={classes.logo}>
          <Group gap="xs">
            <Box
              w={40}
              h={40}
              bg="primary.6"
              style={{ borderRadius: theme.radius.sm }}
            />
            <Text fz="xl" fw={700} c="customBlue.6">
              Skillfully Human
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mt="md">
            Learn fast. Think deep. Stay real.
          </Text>
        </div>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} className={classes.groups}>
          {groups}
        </SimpleGrid>
      </Container>
      <Container className={classes.afterFooter} size="xl">
        <Text c="dimmed" size="sm">
          © {new Date().getFullYear()} Skillfully Human. All rights reserved.
        </Text>

        <Group gap="xs" className={classes.social}>
          <Anchor href="https://twitter.com" target="_blank">
            <IconBrandTwitter size={18} stroke={1.5} />
          </Anchor>
          <Anchor href="https://youtube.com" target="_blank">
            <IconBrandYoutube size={18} stroke={1.5} />
          </Anchor>
          <Anchor href="https://instagram.com" target="_blank">
            <IconBrandInstagram size={18} stroke={1.5} />
          </Anchor>
        </Group>
      </Container>
    </Box>
  );
}

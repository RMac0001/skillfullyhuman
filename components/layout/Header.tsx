'use client';
import {
  Box,
  Container,
  Group,
  Anchor,
  Image,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { usePathname } from 'next/navigation';
import classes from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  const theme = useMantineTheme();
  const pathname = usePathname();

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <Box component="header" className={classes.header}>
      <Container size="xl" h="100%" py={0}>
        <Group justify="space-between" h="100%">
          {/* ✅ Logo wrapped in Next.js Link with no nested <a> */}
          <Anchor href="/">
            <Group gap="xs">
              <Box w={100} h={100}>
                <Image
                  src="/logo.png"
                  alt="Skillfully Human Logo"
                  width={100}
                  height={100}
                  fit="contain"
                  className={'sitelogo'}
                />
              </Box>
              <Text fw={600} size="lg" c="var(--mantine-color-custom-blue-1)">
                Skillfully Human
              </Text>
            </Group>
          </Anchor>

          {/* Add more nav items here */}
          <Group gap="md">
            {navItems.map(item => (
              <Anchor
                key={item.path}
                component={Link}
                href={item.path}
                className={`${classes.link} ${pathname === item.path ? classes.active : ''}`}
                data-active={pathname === item.path ? 'true' : undefined}
              >
                {item.label}
              </Anchor>
            ))}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

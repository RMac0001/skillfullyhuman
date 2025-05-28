// components/ui/BlogPostCard.tsx
'use client';

import {
  Card,
  Text,
  Group,
  Image,
  Box,
  Title,
  Stack,
  Badge,
  Avatar,
  Anchor,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './BlogPostCard.module.css';

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  date: string;
  readingTime: string;
  link: string;
  variant?: 'horizontal' | 'vertical';
}

export function BlogPostCard({
  id,
  title,
  excerpt,
  image,
  author,
  category,
  date,
  readingTime,
  link,
  variant = 'vertical',
}: BlogPostCardProps) {
  const isHorizontal = variant === 'horizontal';

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card
      padding={0}
      radius="md"
      withBorder
      className={`${classes.card} ${isHorizontal ? classes.horizontal : ''}`}
    >
      <Card.Section
        component={Link}
        href={link}
        className={classes.imageContainer}
      >
        <Image
          src={image}
          alt={title}
          h={isHorizontal ? 180 : 220}
          fallbackSrc="https://placehold.co/800x500/eee/aaa?text=Blog+Post"
          className={classes.image}
        />
      </Card.Section>

      <Box p="md">
        <Stack gap="xs">
          <Group>
            <Badge color="primary" radius="sm">
              {category}
            </Badge>
          </Group>

          <Link
            href={link}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Title order={3} className={classes.title} lineClamp={2}>
              {title}
            </Title>
          </Link>

          <Text size="sm" c="dimmed" lineClamp={3} className={classes.excerpt}>
            {excerpt}
          </Text>

          <Box className={classes.footer}>
            <Group>
              <Avatar
                src={author.avatar}
                alt={author.name}
                radius="xl"
                size="sm"
              />
              <Text size="sm" fw={500}>
                {author.name}
              </Text>
            </Group>

            <Group gap="xs" c="dimmed" fz="xs">
              <Text>{formattedDate}</Text>
              <Text>•</Text>
              <Group gap="xs">
                <IconClock size={14} />
                <Text>{readingTime}</Text>
              </Group>
            </Group>
          </Box>

          <Anchor href={link} size="sm" className={classes.readMore}>
            Read More
          </Anchor>
        </Stack>
      </Box>
    </Card>
  );
}

'use client';

import {
  Card,
  Text,
  Group,
  Button,
  Badge,
  Image,
  Box,
  Title,
  AspectRatio,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  badges?: { label: string; color: string }[];
  link: string;
}

export function ProductCard({
  id,
  title,
  price,
  salePrice,
  image,
  category,
  badges = [],
  link,
}: ProductCardProps) {
  const theme = useMantineTheme();
  const isOnSale = salePrice !== undefined && salePrice < price;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const formattedSalePrice = isOnSale
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(salePrice!)
    : null;

  return (
    <Card padding="md" radius="md" withBorder className={classes.card}>
      <Card.Section
        component={Link}
        href={link}
        className={classes.imageSection}
      >
        <AspectRatio ratio={1} mah={300}>
          <Image
            src={image}
            alt={title}
            fit="cover"
            h="100%"
            fallbackSrc="https://placehold.co/400x400/eee/aaa?text=Product+Image"
          />
        </AspectRatio>

        {badges.length > 0 && (
          <Box className={classes.badgeContainer}>
            {badges.map((badge, index) => (
              <Badge
                key={index}
                color={badge.color}
                variant="filled"
                radius="sm"
                size="sm"
                className={classes.badge}
              >
                {badge.label}
              </Badge>
            ))}
          </Box>
        )}

        {isOnSale && (
          <Badge
            color="red"
            variant="filled"
            radius="sm"
            size="sm"
            className={classes.saleBadge}
          >
            Sale
          </Badge>
        )}
      </Card.Section>

      <Box mt="md">
        <Text
          size="xs"
          c="dimmed"
          style={{ textTransform: 'uppercase' }} // ✅ FIXED: replaced `transform` prop
        >
          {category}
        </Text>

        <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Title order={3} className={classes.title} mt="xs" lineClamp={2}>
            {title}
          </Title>
        </Link>

        <Group justify="space-between" align="center" mt="md">
          <Box>
            {isOnSale ? (
              <Group gap="xs">
                <Text fz="lg" fw={700} className={classes.salePrice}>
                  {formattedSalePrice}
                </Text>
                <Text fz="sm" td="line-through" c="dimmed">
                  {formattedPrice}
                </Text>
              </Group>
            ) : (
              <Text fz="lg" fw={700}>
                {formattedPrice}
              </Text>
            )}
          </Box>

          <Button
            size="compact" // ✅ FIXED: replaced `compact` prop
            radius="md"
            leftSection={<IconShoppingCart size={16} />}
          >
            Add to Cart
          </Button>
        </Group>
      </Box>
    </Card>
  );
}

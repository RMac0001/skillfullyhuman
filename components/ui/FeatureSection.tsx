'use client';

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Box,
  ThemeIcon,
  Stack,
  useMantineTheme,
} from '@mantine/core';

import {
  IconBrandGithub,
  IconRocket,
  IconShieldCheck,
  IconUsers,
} from '@tabler/icons-react';

import classes from './FeatureSection.module.css';

// ✅ Map string keys to icon components
const iconMap: Record<string, React.FC<{ size?: number; stroke?: number }>> = {
  github: IconBrandGithub,
  rocket: IconRocket,
  shield: IconShieldCheck,
  users: IconUsers,
};

export interface Feature {
  icon: keyof typeof iconMap; // ✅ use string key
  title: string;
  description: string;
}

interface FeatureSectionProps {
  title: string;
  description?: string;
  features: Feature[];
  columns?: number;
}

export function FeatureSection({
  title,
  description,
  features,
  columns = 3,
}: FeatureSectionProps) {
  const theme = useMantineTheme();

  const items = features.map((feature, index) => {
    const Icon = iconMap[feature.icon];

    return (
      <Box key={index} className={classes.feature}>
        <ThemeIcon
          size={56}
          radius="md"
          variant="light"
          color="primary"
          className={classes.icon}
        >
          <Icon size={28} stroke={1.5} />
        </ThemeIcon>

        <Title order={3} mt="md" mb="xs">
          {feature.title}
        </Title>
        <Text c="dimmed">{feature.description}</Text>
      </Box>
    );
  });

  return (
    <Box className={classes.wrapper}>
      <Container size="lg">
        <Stack align="center" mb={50} ta="center">
          <Title className={classes.sectionTitle}>{title}</Title>
          {description && (
            <Text c="dimmed" className={classes.sectionDescription}>
              {description}
            </Text>
          )}
        </Stack>

        <SimpleGrid
          cols={{ base: 1, xs: 2, md: columns }}
          spacing={{ base: 'xl', md: 50 }}
        >
          {items}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// components/ui/Hero.tsx
'use client';

import {
  Title,
  Text,
  Container,
  Button,
  Overlay,
  Box,
  Group,
  Stack,
} from '@mantine/core';
import classes from './Hero.module.css';

interface HeroProps {
  title: string;
  description: string;
  imageSrc: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  height?: number | string;
  position?: 'center' | 'left' | 'right';
  overlay?: number;
}

export function Hero({
  title,
  description,
  imageSrc,
  primaryButtonText,
  primaryButtonLink = '#',
  secondaryButtonText,
  secondaryButtonLink = '#',
  height = 600,
  position = 'center',
  overlay = 0.4,
}: HeroProps) {
  return (
    <Box
      className={classes.hero}
      style={{
        backgroundImage: `url(${imageSrc})`,
        minHeight: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
        width: '100%',
        height: 'clamp(200px, 30vw, 300px)',
        overflow: 'hidden',
      }}
    >
      <Overlay
        gradient={`linear-gradient(rgba(0, 0, 0, ${overlay}), rgba(0, 0, 0, ${overlay}))`}
        opacity={overlay}
        zIndex={0}
      />
      <Container
        size="lg"
        h="100%"
        className={classes.container}
        pos="relative"
      >
        <Stack
          justify="center"
          //spacing="xl"
          h="100%"
          w={{ base: '100%' }}
          ta={position === 'center' ? 'center' : position}
          style={{
            marginRight: position === 'left' ? 'auto' : 0,
            marginLeft:
              position === 'right'
                ? 'auto'
                : position === 'center'
                  ? 'auto'
                  : 0,
          }}
        >
          <Title className={classes.title} c="white">
            {title}
          </Title>
          <Text className={classes.description} c="white">
            {description}
          </Text>

          {(primaryButtonText || secondaryButtonText) && (
            <Group
              justify={position === 'center' ? 'center' : 'flex-start'}
              mt="md"
            >
              {primaryButtonText && (
                <Button
                  variant="filled"
                  size="lg"
                  radius="md"
                  component="a"
                  href={primaryButtonLink}
                >
                  {primaryButtonText}
                </Button>
              )}

              {secondaryButtonText && (
                <Button
                  variant="outline"
                  size="lg"
                  radius="md"
                  color="gray.0"
                  component="a"
                  href={secondaryButtonLink}
                >
                  {secondaryButtonText}
                </Button>
              )}
            </Group>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

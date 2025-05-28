// components/ui/TestimonialSection.tsx
'use client';

import {
  Title,
  Text,
  Container,
  Box,
  Group,
  Avatar,
  useMantineTheme,
  Paper,
  Rating,
  Stack,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from './TestimonialSection.module.css';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  avatar?: string;
  position?: string;
  rating: number;
}

interface TestimonialSectionProps {
  title: string;
  description?: string;
  testimonials: Testimonial[];
  background?: 'light' | 'gray';
}

export function TestimonialSection({
  title,
  description,
  testimonials,
  background = 'light',
}: TestimonialSectionProps) {
  const theme = useMantineTheme();

  const slides = testimonials.map(testimonial => (
    <Carousel.Slide key={testimonial.id}>
      <Paper
        p="xl"
        radius="md"
        withBorder
        h="100%"
        className={classes.testimonial}
      >
        <Stack h="100%">
          <Box mb="md">
            <Rating value={testimonial.rating} readOnly />
          </Box>

          <Text fz="lg" className={classes.testimonialContent}>
            "{testimonial.content}"
          </Text>

          <Group mt="auto" align="center">
            <Avatar
              src={testimonial.avatar}
              alt={testimonial.author}
              radius="xl"
              size="md"
            />
            <Box>
              <Text fw={700}>{testimonial.author}</Text>
              {testimonial.position && (
                <Text size="sm" c="dimmed">
                  {testimonial.position}
                </Text>
              )}
            </Box>
          </Group>
        </Stack>
      </Paper>
    </Carousel.Slide>
  ));

  return (
    <Box
      className={classes.wrapper}
      bg={background === 'gray' ? 'gray.0' : undefined}
    >
      <Container size="lg">
        <Stack align="center" mb={50} ta="center">
          <Title className={classes.title}>{title}</Title>
          {description && (
            <Text c="dimmed" className={classes.description}>
              {description}
            </Text>
          )}
        </Stack>

        <Carousel
          slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
          slideGap={{ base: 'md', sm: 'xl' }}
          classNames={{
            root: classes.carouselRoot,
            viewport: classes.carouselViewport,
            container: classes.carouselContainer,
          }}
        >
          {slides}
        </Carousel>
      </Container>
    </Box>
  );
}

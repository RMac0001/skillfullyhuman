'use client';
import { Hero } from '@components/ui/Hero';
import { ContactSection } from '@components/ui/ContactSection';
import { NewsletterSection } from '@components/ui/NewsletterSection';
import { Content } from '@components/layout/Content';

import {
  Container,
  Title,
  Text,
  Box,
  SimpleGrid,
  ThemeIcon,
  Stack,
  Paper,
} from '@mantine/core';

import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
} from '@tabler/icons-react';

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contact Us"
        description="We'd love to hear from you. Reach out with any questions, feedback, or inquiries."
        imageSrc="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        height={300}
        position="center"
      />

      <Content>
        <Stack align="center" mb="xl" ta="center">
          <Title order={2}>We're Here For You</Title>
          <Text c="dimmed" maw={600}>
            Our dedicated team is ready to assist you with any questions or
            concerns you may have.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          <Paper p="lg" radius="md" withBorder ta="center">
            <ThemeIcon
              size={50}
              radius="md"
              variant="light"
              color="primary"
              mb="md"
              mx="auto"
            >
              <IconPhone size={24} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} mb="xs">
              Phone
            </Title>
            <Text>+1 (555) 123-4567</Text>
            <Text size="sm" c="dimmed">
              Mon-Fri, 9am-5pm EST
            </Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder ta="center">
            <ThemeIcon
              size={50}
              radius="md"
              variant="light"
              color="primary"
              mb="md"
              mx="auto"
            >
              <IconMail size={24} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} mb="xs">
              Email
            </Title>
            <Text>hello@example.com</Text>
            <Text size="sm" c="dimmed">
              We respond within 24 hours
            </Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder ta="center">
            <ThemeIcon
              size={50}
              radius="md"
              variant="light"
              color="primary"
              mb="md"
              mx="auto"
            >
              <IconMapPin size={24} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} mb="xs">
              Address
            </Title>
            <Text>1234 Market Street</Text>
            <Text size="sm" c="dimmed">
              San Francisco, CA 94102
            </Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder ta="center">
            <ThemeIcon
              size={50}
              radius="md"
              variant="light"
              color="primary"
              mb="md"
              mx="auto"
            >
              <IconClock size={24} stroke={1.5} />
            </ThemeIcon>
            <Title order={4} mb="xs">
              Hours
            </Title>
            <Text>Mon-Fri: 9am-5pm</Text>
            <Text size="sm" c="dimmed">
              Sat-Sun: Closed
            </Text>
          </Paper>
        </SimpleGrid>

        <ContactSection
          title="Send Us a Message"
          description="Have a specific question or comment? Fill out the form below and we'll get back to you as soon as possible."
          mapLocation="https://maps.google.com/maps?q=San%20Francisco&t=&z=13&ie=UTF8&iwloc=&output=embed"
          buttonText="Send Message"
        />

        <Stack align="center" mb="xl" ta="center">
          <Title order={2}>Frequently Asked Questions</Title>
          <Text c="dimmed" maw={600}>
            Find quick answers to our most common questions. If you need
            additional help, please contact us.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Paper p="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              What are your shipping times?
            </Title>
            <Text>
              We offer standard shipping (3-5 business days), expedited shipping
              (2-3 business days), and express shipping (1-2 business days).
              Shipping times may vary depending on your location.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              What is your return policy?
            </Title>
            <Text>
              We accept returns within 30 days of purchase. Items must be
              unused, unworn, and in their original packaging. Please visit our
              Returns page for more details.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Do you ship internationally?
            </Title>
            <Text>
              Yes, we ship to most countries worldwide. International shipping
              typically takes 7-14 business days, and customs fees may apply
              depending on your country's regulations.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              How can I track my order?
            </Title>
            <Text>
              Once your order ships, you'll receive a confirmation email with
              tracking information. You can also track your order by logging
              into your account on our website.
            </Text>
          </Paper>
        </SimpleGrid>
      </Content>

      <NewsletterSection background="primary" />
    </>
  );
}

'use client'; // app/about/page.tsx
import { Hero } from '@components/ui/Hero';
import { NewsletterSection } from '@components/ui/NewsletterSection';

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Box,
  Paper,
  Group,
  Image,
  Timeline,
  ThemeIcon,
  Stack,
  Divider,
  Avatar,
} from '@mantine/core';

import {
  IconUsers,
  IconCalendarEvent,
  IconTrophy,
  IconBuildingStore,
  IconWorldWww,
} from '@tabler/icons-react';

// Sample data for team members
const teamMembers = [
  {
    id: 1,
    name: 'John Doe',
    position: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'John has 15+ years of experience in the fashion industry and founded Skillfully Human with a vision to create sustainable, high-quality products.',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    position: 'Creative Director',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'With a background in fashion design, Sarah leads our creative team and ensures all products meet our high aesthetic standards.',
  },
  {
    id: 3,
    name: 'Michael Chen',
    position: 'Head of Operations',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Michael oversees all operational aspects of Skillfully Human, from supply chain management to customer fulfillment.',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    position: 'Customer Experience Manager',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Emily is dedicated to ensuring that every customer has an exceptional experience when shopping with Skillfully Human.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="About Roger MacRae"
        description="I'm on a mission to bridge the gap between technology and the human experience."
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        height={300}
        position="center"
      />

      {/* Our Story Section */}
      <Box py="xl">
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Box>
              <Title order={2} mb="md">
                Our Story
              </Title>
              <Text mb="md">
                Skillfully Human was founded in 2015 with a simple yet ambitious
                goal: to create a better online shopping experience. We noticed
                that many online stores lacked the personal touch and attention
                to detail that makes shopping enjoyable.
              </Text>
              <Text mb="md">
                What started as a small operation in a garage has grown into a
                thriving e-commerce business with customers all over the world.
                Despite our growth, we've stayed true to our original mission
                and values.
              </Text>
              <Text>
                Today, we offer a curated selection of high-quality products
                across various categories, all chosen with our discerning
                customers in mind. We believe in sustainable practices, ethical
                sourcing, and building long-lasting relationships with our
                customers and partners.
              </Text>
            </Box>
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Our team working together"
                radius="md"
                height={400}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Company Timeline */}
      <Box py="xl" bg="gray.0">
        <Container size="lg">
          <Title order={2} ta="center" mb="xl">
            Our Journey
          </Title>

          <Paper p="xl" radius="md" withBorder>
            <Timeline active={7} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<IconCalendarEvent size={12} />}
                title="2015: The Beginning"
              >
                <Text size="sm">
                  Skillfully Human was founded in a small garage with just 3
                  team members.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconBuildingStore size={12} />}
                title="2016: First Physical Store"
              >
                <Text size="sm">
                  We opened our first physical store in San Francisco, expanding
                  our reach beyond online sales.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconWorldWww size={12} />}
                title="2018: International Expansion"
              >
                <Text size="sm">
                  Skillfully Human began shipping products internationally,
                  reaching customers in over 20 countries.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconTrophy size={12} />}
                title="2020: Industry Recognition"
              >
                <Text size="sm">
                  We won the 'Best E-commerce Platform' award, recognizing our
                  dedication to excellence.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconUsers size={12} />}
                title="2022: Community Milestone"
              >
                <Text size="sm">
                  Our customer community grew to over 100,000 members, creating
                  a vibrant ecosystem around our brand.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={
                  <ThemeIcon
                    size={22}
                    variant="light"
                    color="primary"
                    radius="xl"
                  />
                }
                title="2025: Looking Ahead"
              >
                <Text size="sm">
                  We continue to grow and evolve, with exciting new products and
                  experiences on the horizon.
                </Text>
              </Timeline.Item>
            </Timeline>
          </Paper>
        </Container>
      </Box>

      {/* Team Section */}
      <Box py="xl">
        <Container size="lg">
          <Stack align="center" mb="xl" ta="center">
            <Title order={2}>Meet Our Team</Title>
            <Text c="dimmed" maw={600}>
              Behind every great product is a team of dedicated professionals.
              Get to know the people who make Skillfully Human possible.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            {teamMembers.map(member => (
              <Paper key={member.id} p="lg" radius="md" withBorder>
                <Group>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    size="xl"
                    radius="md"
                  />
                  <Box>
                    <Title order={4}>{member.name}</Title>
                    <Text c="dimmed" size="sm">
                      {member.position}
                    </Text>
                  </Box>
                </Group>
                <Divider my="sm" />
                <Text size="sm">{member.bio}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <NewsletterSection
        title="Join Our Community"
        description="Subscribe to our newsletter to stay updated on company news, product launches, and exclusive offers."
        background="primary"
      />
    </>
  );
}

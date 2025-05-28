'use client';
import { Hero } from '@components/ui/Hero';
import { BlogPostCard } from '@components/ui/BlogPostCard';
import { NewsletterSection } from '@components/ui/NewsletterSection';

import {
  Container,
  Title,
  Text,
  Box,
  SimpleGrid,
  Group,
  Button,
  TextInput,
  Select,
  Paper,
  Stack,
  Badge,
  ActionIcon,
} from '@mantine/core';

import { IconSearch, IconChevronRight } from '@tabler/icons-react';

// Sample data for blog posts
const blogPosts = [
  {
    id: '1',
    title: 'The Ultimate Guide to Summer Fashion Trends',
    excerpt:
      "Discover the hottest fashion trends for the summer season. From vibrant colors to lightweight fabrics, we've got you covered with style tips and outfit inspirations.",
    image:
      'https://images.unsplash.com/photo-1445633629932-0029acc44e88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    category: 'Fashion',
    date: '2025-04-15',
    readingTime: '5 min read',
    link: '/blog/summer-fashion-trends',
  },
  {
    id: '2',
    title: 'How to Build a Sustainable Wardrobe',
    excerpt:
      "Learn how to create a sustainable wardrobe that's both eco-friendly and stylish. We share tips on choosing quality pieces, ethical brands, and extending the life of your clothes.",
    image:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Michael Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    category: 'Sustainability',
    date: '2025-04-10',
    readingTime: '7 min read',
    link: '/blog/sustainable-wardrobe',
  },
  {
    id: '3',
    title: 'The Psychology of Color in Fashion',
    excerpt:
      'Explore how different colors in your wardrobe can affect your mood and perception. This in-depth guide examines the psychological impact of colors and how to use them to express yourself.',
    image:
      'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Emily Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    category: 'Psychology',
    date: '2025-04-05',
    readingTime: '8 min read',
    link: '/blog/psychology-of-color',
  },
  {
    id: '4',
    title: 'The Rise of Minimalist Fashion',
    excerpt:
      "Minimalist fashion is more than just a trend—it's a lifestyle. Discover the philosophy behind minimalism and how to incorporate it into your wardrobe for a timeless style.",
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'David Wilson',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    category: 'Lifestyle',
    date: '2025-04-01',
    readingTime: '6 min read',
    link: '/blog/minimalist-fashion',
  },
  {
    id: '5',
    title: 'A Complete Guide to Caring for Your Leather Goods',
    excerpt:
      'Leather items are an investment that can last for years with proper care. Learn the essential techniques for maintaining and preserving your leather accessories and apparel.',
    image:
      'https://images.unsplash.com/photo-1531938716357-224c16b5ace3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Jessica Martinez',
      avatar:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    category: 'Products',
    date: '2025-03-25',
    readingTime: '9 min read',
    link: '/blog/leather-care-guide',
  },
  {
    id: '6',
    title: 'The Evolution of Street Style',
    excerpt:
      'From urban subcultures to high fashion runways, street style has made a significant impact on the fashion industry. Trace its evolution and influence on contemporary fashion.',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Alex Thompson',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    },
    category: 'Fashion',
    date: '2025-03-20',
    readingTime: '7 min read',
    link: '/blog/street-style-evolution',
  },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'products', label: 'Products' },
];

const featuredPost = blogPosts[0];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Our Blog"
        description="Insights, tips, and stories from the world of fashion and beyond."
        imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        height={300}
        position="center"
      />

      {/* Featured Post Section */}
      <Box py="xl">
        <Container size="lg">
          <Title order={2} mb="lg">
            Featured Post
          </Title>

          <BlogPostCard
            id={featuredPost.id}
            title={featuredPost.title}
            excerpt={featuredPost.excerpt}
            image={featuredPost.image}
            author={featuredPost.author}
            category={featuredPost.category}
            date={featuredPost.date}
            readingTime={featuredPost.readingTime}
            link={featuredPost.link}
            variant="horizontal"
          />
        </Container>
      </Box>

      {/* Blog Filters & Search */}
      <Box py="md" bg="gray.0">
        <Container size="lg">
          <Paper p="md" radius="md" withBorder>
            <Group align="flex-end">
              <TextInput
                placeholder="Search blog posts"
                leftSection={<IconSearch size={16} />}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Categories"
                data={categories}
                defaultValue="all"
                style={{ width: 200 }}
              />
              <Button>Search</Button>
            </Group>
          </Paper>
        </Container>
      </Box>

      {/* Blog Posts Grid */}
      <Box py="xl">
        <Container size="lg">
          <Group justify="space-between" mb="lg">
            <Title order={2}>Latest Posts</Title>

            <Group gap="xs">
              <Text c="dimmed">Popular tags:</Text>
              <Group gap="xs">
                <Badge color="primary" variant="light" radius="sm">
                  Fashion
                </Badge>
                <Badge color="grape" variant="light" radius="sm">
                  Lifestyle
                </Badge>
                <Badge color="indigo" variant="light" radius="sm">
                  Design
                </Badge>
                <Badge color="teal" variant="light" radius="sm">
                  Tips
                </Badge>
              </Group>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {blogPosts.slice(1).map(post => (
              <BlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                image={post.image}
                author={post.author}
                category={post.category}
                date={post.date}
                readingTime={post.readingTime}
                link={post.link}
              />
            ))}
          </SimpleGrid>

          {/* Pagination */}
          <Stack align="center" mt="xl">
            <Group gap="xs">
              <Button variant="default" radius="md">
                1
              </Button>
              <Button variant="outline" radius="md">
                2
              </Button>
              <Button variant="outline" radius="md">
                3
              </Button>
              <Text>...</Text>
              <Button variant="outline" radius="md">
                8
              </Button>
              <ActionIcon variant="outline" radius="md">
                <IconChevronRight size={16} />
              </ActionIcon>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <NewsletterSection
        title="Subscribe to Our Blog"
        description="Stay updated with our latest articles, fashion tips, and exclusive content delivered directly to your inbox."
        buttonText="Subscribe"
        background="primary"
      />
    </>
  );
}

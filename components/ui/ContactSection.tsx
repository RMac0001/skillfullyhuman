// components/ui/ContactSection.tsx
'use client';

import {
  TextInput,
  Textarea,
  SimpleGrid,
  Group,
  Title,
  Text,
  Button,
  Container,
  Box,
  Paper,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconMapPin,
  IconPhone,
  IconAt,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react';
import classes from './ContactSection.module.css';

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

interface ContactSectionProps {
  title?: string;
  description?: string;
  mapLocation?: string;
  buttonText?: string;
  contactInfo?: ContactInfo[];
}

export function ContactSection({
  title = 'Get in Touch',
  description = "Have questions about our products or services? Fill out the form below and we'll get back to you as soon as possible.",
  mapLocation = 'https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed',
  buttonText = 'Send Message',
  contactInfo,
}: ContactSectionProps) {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      name: value =>
        value.trim().length < 2
          ? 'Name must include at least 2 characters'
          : null,
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      subject: value =>
        value.trim().length === 0 ? 'Subject is required' : null,
      message: value =>
        value.trim().length < 10
          ? 'Message must include at least 10 characters'
          : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Form submitted:', values);
    // Here you would typically send this to your API
    form.reset();
  };

  const defaultContactInfo: ContactInfo[] = [
    {
      icon: <IconMapPin size={24} stroke={1.5} />,
      title: 'Our Address',
      description: '1234 Market Street, San Francisco, CA 94102, USA',
      link: 'https://maps.google.com/?q=1234+Market+Street,+San+Francisco,+CA+94102,+USA',
    },
    {
      icon: <IconPhone size={24} stroke={1.5} />,
      title: 'Phone',
      description: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <IconAt size={24} stroke={1.5} />,
      title: 'Email',
      description: 'hello@example.com',
      link: 'mailto:hello@example.com',
    },
    {
      icon: <IconBrandTwitter size={24} stroke={1.5} />,
      title: 'Twitter',
      description: '@hellocommerce',
      link: 'https://twitter.com/hellocommerce',
    },
    {
      icon: <IconBrandFacebook size={24} stroke={1.5} />,
      title: 'Facebook',
      description: 'HelloCommerce',
      link: 'https://facebook.com/hellocommerce',
    },
    {
      icon: <IconBrandInstagram size={24} stroke={1.5} />,
      title: 'Instagram',
      description: '@hellocommerce',
      link: 'https://instagram.com/hellocommerce',
    },
  ];

  const infoItems = (contactInfo || defaultContactInfo).map((item, index) => (
    <Box
      component="a"
      href={item.link}
      key={index}
      className={classes.contactItem}
    >
      <Box className={classes.contactIcon}>{item.icon}</Box>
      <Box>
        <Text fw={700} size="sm" mb={3}>
          {item.title}
        </Text>
        <Text c="dimmed" size="sm">
          {item.description}
        </Text>
      </Box>
    </Box>
  ));

  return (
    <Box py="xl">
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Box>
            <Title className={classes.title}>{title}</Title>
            <Text c="dimmed" mt="sm" mb="lg">
              {description}
            </Text>

            <Paper withBorder p="md" radius="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                {infoItems}
              </SimpleGrid>
            </Paper>

            <Box mt="xl" className={classes.mapContainer}>
              <iframe
                src={mapLocation}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
                className={classes.map}
              />
            </Box>
          </Box>

          <Box>
            <Paper
              withBorder
              p="lg"
              radius="md"
              className={classes.formContainer}
            >
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label="Name"
                      placeholder="Your name"
                      required
                      {...form.getInputProps('name')}
                    />
                    <TextInput
                      label="Email"
                      placeholder="Your email"
                      required
                      {...form.getInputProps('email')}
                    />
                  </SimpleGrid>

                  <TextInput
                    label="Subject"
                    placeholder="Subject"
                    required
                    {...form.getInputProps('subject')}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Your message"
                    minRows={5}
                    required
                    {...form.getInputProps('message')}
                  />

                  <Group justify="flex-end" mt="md">
                    <Button type="submit" size="md">
                      {buttonText}
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Paper>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

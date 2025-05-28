// components/ui/NewsletterSection.tsx
'use client';

import {
  TextInput,
  Button,
  Group,
  Container,
  Title,
  Text,
  Paper,
  Box,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './NewsletterSection.module.css';

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  background?: 'light' | 'primary' | 'gray';
}

export function NewsletterSection({
  title = 'Subscribe to Our Newsletter',
  description = 'Stay updated with our latest news, product releases, and exclusive offers.',
  placeholder = 'Your email',
  buttonText = 'Subscribe',
  background = 'light',
}: NewsletterSectionProps) {
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Subscribed:', values.email);
    // Here you would typically send this to your API or email service
    form.reset();
  };

  const getBackgroundColor = () => {
    switch (background) {
      case 'primary':
        return 'var(--mantine-color-primary-6)';
      case 'gray':
        return 'var(--mantine-color-gray-0)';
      default:
        return 'white';
    }
  };

  const getTextColor = () => {
    return background === 'primary' ? 'white' : 'inherit';
  };

  return (
    <Box
      className={classes.wrapper}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <Container size="md">
        <Paper
          withBorder={background === 'light'}
          p={{ base: 'md', sm: 'xl' }}
          radius="md"
          className={classes.paper}
          style={{
            backgroundColor: background === 'light' ? 'white' : 'transparent',
          }}
        >
          <Title
            order={2}
            ta="center"
            mb="md"
            className={classes.title}
            style={{ color: getTextColor() }}
          >
            {title}
          </Title>

          <Text
            ta="center"
            mb="xl"
            c={background === 'primary' ? 'white' : 'dimmed'}
          >
            {description}
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group gap="sm" wrap="nowrap" align="flex-start">
              <TextInput
                style={{ flex: 1 }}
                size="md"
                radius="md"
                placeholder={placeholder}
                required
                {...form.getInputProps('email')}
              />
              <Button
                type="submit"
                size="md"
                radius="md"
                variant={background === 'primary' ? 'white' : 'filled'}
                color={background === 'primary' ? 'dark' : 'primary'}
              >
                {buttonText}
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

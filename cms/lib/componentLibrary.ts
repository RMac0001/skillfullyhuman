// lib/componentLibrary.ts
// component library for cms
import { Button, Title, Text } from '@mantine/core';

export const componentLibrary = {
  Button: {
    component: Button,
    displayName: 'Button',
    defaultProps: {
      children: 'Click me',
      color: 'blue',
      size: 'md',
    },
    props: {
      color: ['blue', 'red', 'green', 'teal', 'violet'],
      size: ['xs', 'sm', 'md', 'lg', 'xl'],
      variant: ['filled', 'outline', 'light', 'subtle', 'default'],
    },
  },
  Title: {
    component: Title,
    displayName: 'Title',
    defaultProps: {
      children: 'This is a title',
      order: 2,
    },
    props: {
      order: [1, 2, 3, 4],
    },
  },
  Text: {
    component: Text,
    displayName: 'Text',
    defaultProps: {
      children: 'This is some text',
      size: 'md',
      c: 'gray.7',
    },
    props: {
      size: ['xs', 'sm', 'md', 'lg', 'xl'],
      c: ['dimmed', 'gray.6', 'gray.7', 'blue.6'],
    },
  },
};

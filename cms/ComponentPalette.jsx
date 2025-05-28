// components/ComponentPalette.jsx
import React from 'react';
import {
  Paper,
  Text,
  Stack,
  Group,
  Title,
  useMantineTheme,
  Box,
} from '@mantine/core';

// Icons
import {
  IconHeading,
  IconParagraph,
  IconList,
  IconCardsFilled,
  IconButton,
} from '@tabler/icons-react';

function ComponentPalette({ editor }) {
  const theme = useMantineTheme();

  // Helper to insert a block when dragged into the editor
  const handleDragStart = (e, blockType) => {
    // Store the block type in the drag event
    e.dataTransfer.setData('application/blocknote-block', blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const components = [
    {
      id: 'heading',
      name: 'Heading',
      icon: <IconHeading size={20} />,
      type: 'heading',
      props: { level: 1, content: 'New Heading' },
    },
    {
      id: 'paragraph',
      name: 'Paragraph',
      icon: <IconParagraph size={20} />,
      type: 'paragraph',
      props: { content: 'New paragraph text' },
    },
    {
      id: 'bulletList',
      name: 'Bullet List',
      icon: <IconList size={20} />,
      type: 'bulletListItem',
      props: { content: 'New list item' },
    },
    {
      id: 'card',
      name: 'Card',
      icon: <IconCardsFilled size={20} />,
      type: 'card',
      props: {},
    },
    {
      id: 'button',
      name: 'Button',
      icon: <IconButton size={20} />,
      type: 'button',
      props: {},
    },
  ];

  return (
    <Paper
      p="md"
      withBorder
      shadow="md"
      sx={theme => ({
        position: 'sticky',
        top: '20px',
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      <Title order={4} mb="md">
        Components
      </Title>
      <Stack spacing="xs">
        {components.map(component => (
          <Box
            key={component.id}
            draggable
            onDragStart={e => handleDragStart(e, component.type)}
            sx={theme => ({
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.gray[3]}`,
              backgroundColor: theme.white,
              cursor: 'grab',
              '&:hover': {
                backgroundColor: theme.colors.gray[0],
              },
            })}
          >
            <Group spacing="xs">
              {component.icon}
              <Text size="sm">{component.name}</Text>
            </Group>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default ComponentPalette;

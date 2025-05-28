// components/customBlocks.js
import { createReactBlockSpec, defaultProps } from '@blocknote/react';
import {
  Paper,
  Stack,
  TextInput,
  ColorInput,
  NumberInput,
  Button,
  Text,
  Group,
  Image,
  Card,
  Badge,
} from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';

// Custom Card Block
export const CardBlock = createReactBlockSpec({
  type: 'card',
  propSchema: {
    ...defaultProps,
    title: {
      default: 'Card Title',
    },
    description: {
      default: 'Card description goes here',
    },
    imageUrl: {
      default: '',
    },
    backgroundColor: {
      default: '#ffffff',
    },
  },
  render: ({ block, editor }) => {
    // For editing mode
    if (editor.isEditable) {
      return (
        <Paper
          p="md"
          withBorder
          shadow="sm"
          sx={{ backgroundColor: block.props.backgroundColor }}
        >
          <Stack spacing="xs">
            {/* Custom UI for editing card properties */}
            <Group position="apart">
              <div className="bn-grab-handle" style={{ cursor: 'grab' }}>
                <IconGripVertical size={18} />
              </div>
              <Badge>Card Block</Badge>
            </Group>

            <TextInput
              label="Title"
              value={block.props.title}
              onChange={e => {
                editor.updateBlock(block, {
                  props: { title: e.target.value },
                });
              }}
            />

            <TextInput
              label="Description"
              value={block.props.description}
              onChange={e => {
                editor.updateBlock(block, {
                  props: { description: e.target.value },
                });
              }}
            />

            <TextInput
              label="Image URL"
              value={block.props.imageUrl}
              onChange={e => {
                editor.updateBlock(block, {
                  props: { imageUrl: e.target.value },
                });
              }}
            />

            <ColorInput
              label="Background Color"
              value={block.props.backgroundColor}
              onChange={value => {
                editor.updateBlock(block, {
                  props: { backgroundColor: value },
                });
              }}
            />
          </Stack>
        </Paper>
      );
    }

    // For preview mode (when not editing)
    return (
      <Card
        shadow="sm"
        p="lg"
        style={{
          backgroundColor: block.props.backgroundColor,
        }}
      >
        {block.props.imageUrl && (
          <Card.Section>
            <Image
              src={block.props.imageUrl}
              height={160}
              alt={block.props.title}
            />
          </Card.Section>
        )}

        <Text weight={500} size="lg" mt="md">
          {block.props.title}
        </Text>

        <Text size="sm" color="dimmed">
          {block.props.description}
        </Text>
      </Card>
    );
  },
});

// Button Block
export const ButtonBlock = createReactBlockSpec({
  type: 'button',
  propSchema: {
    ...defaultProps,
    label: {
      default: 'Click Me',
    },
    color: {
      default: 'blue',
    },
    size: {
      default: 'md',
    },
    fullWidth: {
      default: false,
    },
  },
  render: ({ block, editor }) => {
    // For editing mode
    if (editor.isEditable) {
      return (
        <Paper p="md" withBorder shadow="sm">
          <Stack spacing="xs">
            <Group position="apart">
              <div className="bn-grab-handle" style={{ cursor: 'grab' }}>
                <IconGripVertical size={18} />
              </div>
              <Badge>Button Block</Badge>
            </Group>

            <TextInput
              label="Label"
              value={block.props.label}
              onChange={e => {
                editor.updateBlock(block, {
                  props: { label: e.target.value },
                });
              }}
            />

            <ColorInput
              label="Color"
              value={block.props.color}
              onChange={value => {
                editor.updateBlock(block, {
                  props: { color: value },
                });
              }}
            />

            <Button
              color={block.props.color}
              fullWidth={block.props.fullWidth}
              size={block.props.size}
            >
              {block.props.label}
            </Button>
          </Stack>
        </Paper>
      );
    }

    // For preview mode
    return (
      <Button
        color={block.props.color}
        fullWidth={block.props.fullWidth}
        size={block.props.size}
      >
        {block.props.label}
      </Button>
    );
  },
});

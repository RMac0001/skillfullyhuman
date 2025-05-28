// components/PageEditor.jsx
import React, { useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

// Import required CSS
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// Import Mantine components
import {
  AppShell,
  Navbar,
  Header,
  Box,
  Title,
  Grid,
  Group,
  Switch,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';

// Import custom components
import ComponentPalette from './ComponentPalette';
import { CardBlock, ButtonBlock } from './customBlocks';

// Icons
import {
  IconSun,
  IconMoon,
  IconDeviceFloppy,
  IconEye,
} from '@tabler/icons-react';

function PageEditor() {
  const [previewMode, setPreviewMode] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // Create a BlockNote editor with custom blocks
  const editor = useCreateBlockNote({
    domAttributes: {
      // This enables dropping elements from outside
      editor: {
        class: 'my-editor',
        'data-enable-external-drop': 'true',
      },
    },
    // Register our custom blocks
    blockSpecs: {
      card: CardBlock,
      button: ButtonBlock,
    },
    // Handle external drops (from our component palette)
    onDrop: event => {
      // Check if this is a drop from our component palette
      const blockType = event.dataTransfer?.getData(
        'application/blocknote-block',
      );

      if (!blockType) return false; // Not our drop, let BlockNote handle it

      // Get position in the editor where the item was dropped
      const targetPos = editor.getPositionFromDOMEvent(event);
      if (!targetPos) return false;

      // Insert the new block at the drop position
      editor.insertBlocks(
        [
          {
            type: blockType,
            props: {}, // Default props will be used from the block spec
          },
        ],
        targetPos,
      );

      return true; // We handled this drop
    },
  });

  // Function to save the editor content
  const saveContent = () => {
    const content = editor.topLevelBlocks;
    console.log('Saving content:', content);
    // Here you would typically save to a backend or localStorage
    alert('Content saved to console. Check developer tools.');
  };

  // Handle toggling preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    editor.domAttributes.editor = {
      ...editor.domAttributes.editor,
      'data-editable': (!previewMode).toString(),
    };
    editor.isEditable = !previewMode;
  };

  return (
    <AppShell
      padding="md"
      navbar={
        !previewMode ? (
          <Navbar width={{ base: 250 }} p="xs">
            <ComponentPalette editor={editor} />
          </Navbar>
        ) : undefined
      }
      header={
        <Header height={60} p="xs">
          <Group position="apart">
            <Title order={3}>Mantine Page Editor</Title>
            <Group>
              <Tooltip label="Toggle preview mode">
                <Switch
                  checked={previewMode}
                  onChange={togglePreviewMode}
                  label="Preview"
                  thumbIcon={previewMode ? <IconEye size={12} /> : null}
                />
              </Tooltip>

              <Tooltip label="Save content">
                <ActionIcon color="blue" onClick={saveContent}>
                  <IconDeviceFloppy size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Toggle color scheme">
                <ActionIcon onClick={() => toggleColorScheme()}>
                  {colorScheme === 'dark' ? (
                    <IconSun size={20} />
                  ) : (
                    <IconMoon size={20} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Header>
      }
      styles={theme => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Box
        sx={theme => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          minHeight: 'calc(100vh - 140px)',
        })}
      >
        <BlockNoteView editor={editor} editable={!previewMode} />
      </Box>
    </AppShell>
  );
}

export default PageEditor;

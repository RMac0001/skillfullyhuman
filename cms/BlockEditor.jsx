// components/BlockEditor.jsx
import React from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

// Import required CSS
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// Import Mantine components
import { Box, Title, Container } from '@mantine/core';

function BlockEditor() {
  // Create a new editor instance
  const editor = useCreateBlockNote();

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md">
        Page Editor
      </Title>
      <Box
        sx={theme => ({
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: theme.radius.md,
          overflow: 'hidden',
        })}
      >
        <BlockNoteView editor={editor} />
      </Box>
    </Container>
  );
}

export default BlockEditor;

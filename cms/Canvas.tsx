// components/Canvas.tsx
'use client';

import { Box, Stack, Paper } from '@mantine/core';
import { componentLibrary } from '@/lib/componentLibrary';

type ComponentType = keyof typeof componentLibrary;

interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

interface CanvasProps {
  components: CanvasComponent[];
  onSelectAction: (index: number) => void;
  selectedIndex: number | null;
}

export function Canvas({
  components,
  onSelectAction,
  selectedIndex,
}: CanvasProps) {
  return (
    <Paper withBorder p="md" radius="md" shadow="xs">
      <Stack>
        {components.map((comp, index) => {
          const Component = componentLibrary[comp.type]?.component;
          if (!Component) return null;

          return (
            <Box
              key={comp.id}
              p="xs"
              bg={index === selectedIndex ? 'blue.0' : 'transparent'}
              style={{ cursor: 'pointer', borderRadius: 8 }}
              onClick={() => onSelectAction(index)}
            >
              <Component {...comp.props} />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

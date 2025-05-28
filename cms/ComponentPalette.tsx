// components/ComponentPalette.tsx
'use client';

import { Card, Stack, Button, Title } from '@mantine/core';
import { componentLibrary } from '@/lib/componentLibrary';

interface ComponentPaletteProps {
  onAddAction: (type: string) => void;
}

export function ComponentPalette({ onAddAction }: ComponentPaletteProps) {
  return (
    <Card withBorder shadow="sm" p="md">
      <Title order={4} mb="sm">
        Component Palette
      </Title>
      <Stack>
        {Object.keys(componentLibrary).map(type => (
          <Button key={type} variant="light" onClick={() => onAddAction(type)}>
            Add{' '}
            {
              componentLibrary[type as keyof typeof componentLibrary]
                .displayName
            }
          </Button>
        ))}
      </Stack>
    </Card>
  );
}

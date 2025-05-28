// /app/admin/page.tsx
'use client';

import { useState } from 'react';
import { Container, Stack, Title, Paper } from '@mantine/core';
import { componentLibrary } from '@lib/componentLibrary';
import { Canvas } from '@components/Canvas';
import { ComponentPalette } from '@components/ComponentPalette';
import PropertyEditor from '@components/PropertyEditor';

export default function AdminEditorPage() {
  const [components, setComponents] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const addComponent = (type: string) => {
    const newComponent = {
      id: crypto.randomUUID(),
      type,
      props:
        componentLibrary[type as keyof typeof componentLibrary]?.defaultProps ||
        {},
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const updateProps = (props: any) => {
    if (selectedIndex === null) return;
    const newComponents = [...components];
    newComponents[selectedIndex].props = props;
    setComponents(newComponents);
  };

  return (
    <Container>
      <Title order={1} mb="md">
        Skillfully Human Visual Editor
      </Title>
      <Stack>
        <ComponentPalette onAddAction={addComponent} />
        <Canvas
          components={components}
          onSelectAction={setSelectedIndex}
          selectedIndex={selectedIndex}
        />
        {selectedIndex !== null && (
          <PropertyEditor
            component={components[selectedIndex]}
            onChangeAction={updateProps}
          />
        )}
        <Paper withBorder p="md" mt="lg">
          <Title order={4}>Export JSX</Title>
          <pre>
            {components
              .map(
                c => `
<${c.type} ${Object.entries(c.props)
                  .map(([k, v]) => `${k}="${v}"`)
                  .join(' ')} />`,
              )
              .join('\n')}
          </pre>
        </Paper>
      </Stack>
    </Container>
  );
}

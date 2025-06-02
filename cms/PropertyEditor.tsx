// components/PropertyEditor.tsx
'use client';

import { Card, Stack, Select, TextInput, Title } from '@mantine/core';
import { componentLibrary } from '@cms/lib/componentLibrary';

type ComponentType = keyof typeof componentLibrary;

interface PropertyEditorProps {
  component: { type: ComponentType; props: Record<string, any> };
  onChangeAction: (updatedProps: any) => void;
}

export default function PropertyEditor({
  component,
  onChangeAction,
}: PropertyEditorProps) {
  const { type, props } = component;
  const schema = componentLibrary[type]?.props || {};

  const handleChange = (key: string, value: string) => {
    onChangeAction({ ...props, [key]: value });
  };

  return (
    <Card withBorder shadow="sm" p="md">
      <Title order={4} mb="sm">
        Edit Props: {type}
      </Title>
      <Stack>
        {Object.entries(schema).map(([key, options]) => (
          <Select
            key={key}
            label={key}
            value={props[key] || ''}
            onChange={value => handleChange(key, value || '')}
            data={
              Array.isArray(options)
                ? options.map(v => ({ value: String(v), label: String(v) }))
                : []
            }
          />
        ))}
        {Object.entries(props)
          .filter(([key]) => !(schema as Record<string, any>)[key])
          .map(([key, value]) => (
            <TextInput
              key={key}
              label={key}
              value={String(value)}
              onChange={e => handleChange(key, e.currentTarget.value)}
            />
          ))}
      </Stack>
    </Card>
  );
}

import { Group, Button, AppShell, rem, Badge } from '@mantine/core';

export function Demo() {
  return (
    <Group>
      <Button color="sugar-milk" variant="filled">
        Sugar Milk button
      </Button>
      <Button>Default button</Button>
    </Group>
  );
}

export function Demo2() {
  return (
    <AppShell header={{ height: 100 }}>
      <AppShell.Header>Header</AppShell.Header>
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        {/* Content */}
        Content
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
}

export function Demo3() {
  return (
    <Group>
      <Badge color="lime" variant="filled">
        ONLINE
      </Badge>
      <Badge color="var(--mantine-color-red-9">CUSTOM</Badge>
    </Group>
  );
}

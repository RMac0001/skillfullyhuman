import { ReactNode } from 'react';
import { Box, Container } from '@mantine/core';

interface LayoutProps {
  children: ReactNode;
}

export function Content({ children }: LayoutProps) {
  return (
    <Box py="xl" className="content-wrap">
      <Container size="lg" className="content">
        {children}
      </Container>
    </Box>
  );
}

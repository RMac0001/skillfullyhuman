import { Box } from '@mantine/core';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="layout">
      <Header />
      <Box component="main" className="main">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

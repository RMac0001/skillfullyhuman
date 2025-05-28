// app/about/page.tsx
'use client';

import { Content } from '@components/layout/Content';
import { Hero } from '@/components/ui/Hero';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Sample Page"
        description="This is just a sample page to test components and the layout"
        imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        height={300}
        position="center"
      />

      {/* Content Section */}
      <Content>
        <p>This is some content</p>
      </Content>
    </>
  );
}

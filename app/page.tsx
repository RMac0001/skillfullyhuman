'use client';

import { PrimaryButton } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <PrimaryButton onClick={() => alert('Working!')}>Click Me</PrimaryButton>
    </main>
  );
}

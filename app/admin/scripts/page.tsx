// app/admin/scripts/page.tsx
import { Metadata } from 'next';
import ScriptsClient from './ScriptsClient';

export const metadata: Metadata = {
  title: 'Scripts & Tests | Admin Dashboard',
  description: 'Manage and run maintenance scripts and tests',
};

export default function ScriptsPage() {
  return <ScriptsClient />;
}

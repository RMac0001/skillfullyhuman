// app/admin/server-status/page.tsx
import { Metadata } from 'next';
import ServerStatusClient from './ServerStatusClient';

export const metadata: Metadata = {
  title: 'Server Status | Admin Dashboard',
  description: 'Monitor the health and status of your server components',
};

export default function ServerStatusPage() {
  return <ServerStatusClient />;
}

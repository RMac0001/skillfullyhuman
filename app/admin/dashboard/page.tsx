// app/admin/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session?.user?.name || 'Admin'}
        </p>

        <div className="mt-6">
          <p>This is your admin dashboard. Add components here.</p>

          <div className="mt-4">
            <Link
              href="/admin/server-status"
              className="text-blue-600 hover:text-blue-800"
            >
              View Server Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

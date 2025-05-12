'use client';

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminProtected>{children}</AdminProtected>
    </SessionProvider>
  );
}

function AdminProtected({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Allow unauthenticated access to login page
  if (pathname === '/admin/login') {
    // If user is already logged in, redirect to dashboard
    if (session) {
      redirect('/admin/dashboard');
    }
    return <>{children}</>;
  }

  // Require authentication for all other admin routes
  if (!session) {
    redirect('/admin/login');
  }

  // Check for admin role with proper type safety
  if (!session.user || session.user.role !== 'admin') {
    redirect('/access-denied');
  }

  return <>{children}</>;
}

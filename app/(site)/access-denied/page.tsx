// app/access-denied/page.tsx
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mb-6 text-gray-600">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is an error.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

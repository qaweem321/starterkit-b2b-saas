import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-gray-600">
          This page doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Go to dashboard
          </Link>
          <Link href="/" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

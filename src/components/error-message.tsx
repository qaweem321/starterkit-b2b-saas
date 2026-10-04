"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

export function ErrorMessage({ error, retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-600">
        Sorry, we couldn&apos;t complete that. Please try again. If it keeps happening, contact support
        {error.digest ? (
          <>
            {" "}and mention code <code className="rounded bg-gray-100 px-1">{error.digest}</code>
          </>
        ) : null}
        .
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => retry()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
        <Link href="/dashboard" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { isDemoMode } from "@/lib/demo";
import { redirectIfLoggedIn } from "@/lib/session";

export const metadata: Metadata = { title: "Forgot password" };

export default async function Layout({ children }: { children: ReactNode }) {
  await redirectIfLoggedIn();
  // The demo sends no emails, so a reset link would never arrive.
  if (isDemoMode()) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground">
            Emails are turned off in this demo, so passwords can&apos;t be reset. Sign up again with
            another email address instead.
          </p>
          <Link href="/signup" className="block text-sm text-link hover:underline">
            Sign up
          </Link>
        </div>
      </main>
    );
  }
  return children;
}

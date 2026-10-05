import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold text-link">404</p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          This page doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
        <div className="flex justify-center gap-3">
          <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}

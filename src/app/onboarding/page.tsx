import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireUser } from "@/lib/session";
import { createOrganization } from "./actions";

export const metadata: Metadata = { title: "Create organization" };

export default async function OnboardingPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form action={createOrganization} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Create your organization</h1>
        <p className="text-muted-foreground">
          Hi {user.name}! An organization is your team&apos;s workspace. You can invite teammates
          later.
        </p>

        <Input
          name="name"
          required
          maxLength={60}
          placeholder="Company or team name"
          autoComplete="organization"
        />

        <SubmitButton size="full" pendingText="Creating...">
          Create organization
        </SubmitButton>
      </form>
    </main>
  );
}

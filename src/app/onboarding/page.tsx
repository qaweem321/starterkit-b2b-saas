import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { createOrganization } from "./actions";

export const metadata: Metadata = { title: "Create organization" };

export default async function OnboardingPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form action={createOrganization} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Create your organization</h1>
        <p className="text-gray-600">
          Hi {user.name}! An organization is your team&apos;s workspace. You can invite teammates later.
        </p>

        <input
          name="name"
          required
          maxLength={60}
          placeholder="Company or team name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />

        <button className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">
          Create organization
        </button>
      </form>
    </main>
  );
}

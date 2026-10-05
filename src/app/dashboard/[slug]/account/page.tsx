import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeSelect } from "@/components/theme";
import { requireMembership } from "@/lib/session";
import { PasswordForm } from "./password-form";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user } = await requireMembership(slug);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-1 text-muted-foreground">Your personal settings. These apply in every organization.</p>

      <Section title="Profile" description={`Signed in as ${user.email}.`}>
        <ProfileForm name={user.name} />
      </Section>

      <Section title="Password" description="Changing your password logs you out on your other devices.">
        <PasswordForm />
      </Section>

      <Section
        title="Appearance"
        description={`Saved on this device. "System" follows your device's light or dark setting.`}
      >
        <label htmlFor="theme" className="block text-sm font-medium">
          Theme
        </label>
        <ThemeSelect />
      </Section>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-8 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

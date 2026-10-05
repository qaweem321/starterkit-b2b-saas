import type { ReactNode } from "react";
import { DesktopSidebar, MobileMenu } from "@/components/dashboard-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { getUserOrganizations, requireMembership, requireUser } from "@/lib/session";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function OrganizationLayout({ children, params }: Props) {
  const { slug } = await params;
  const user = await requireUser();
  const [{ organization }, organizations] = await Promise.all([
    requireMembership(slug),
    getUserOrganizations(user.id),
  ]);

  return (
    <div className="min-h-screen flex">
      <DesktopSidebar slug={slug} organizations={organizations} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <MobileMenu slug={slug} organizations={organizations} />
            <span className="truncate text-sm font-medium text-subtle-foreground">{organization.name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <SignOutButton />
            <div
              title={user.email}
              className="h-8 w-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

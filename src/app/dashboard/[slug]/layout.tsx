import Link from "next/link";
import type { ReactNode } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import { getUserOrganizations, requireMembership } from "@/lib/session";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function OrganizationLayout({ children, params }: Props) {
  const { slug } = await params;
  const { user, organization } = await requireMembership(slug);
  const userOrganizations = await getUserOrganizations(user.id);

  const navItems = [
    { label: "Overview", href: `/dashboard/${slug}` },
    { label: "Members", href: `/dashboard/${slug}/members` },
    { label: "Billing", href: `/dashboard/${slug}/billing` },
    { label: "Settings", href: `/dashboard/${slug}/settings` },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-gray-50 p-4 hidden md:flex md:flex-col">
        <Link href="/" className="block px-2 mb-8 text-lg font-bold">
          Starter<span className="text-blue-600">Kit</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <p className="px-2 mb-2 text-xs font-semibold uppercase text-gray-400">Your organizations</p>
          {userOrganizations.map((org) => (
            <Link
              key={org.slug}
              href={`/dashboard/${org.slug}`}
              className={`block px-2 py-1.5 rounded-md text-sm hover:bg-gray-200 ${
                org.slug === slug ? "font-semibold text-gray-900" : "text-gray-600"
              }`}
            >
              {org.name}
            </Link>
          ))}
          <Link href="/onboarding" className="block px-2 py-1.5 text-sm text-blue-600 hover:underline">
            + New organization
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 px-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">{organization.name}</span>
          <div className="flex items-center gap-4">
            <SignOutButton />
            <div
              title={user.email}
              className="h-8 w-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Members", href: "/dashboard/members" },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-gray-50 p-4 hidden md:block">
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
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 px-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Acme Inc.</span>
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
            Q
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

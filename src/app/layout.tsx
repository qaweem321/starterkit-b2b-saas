import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StarterKit: B2B SaaS starter kit",
    template: "%s · StarterKit",
  },
  description: "Teams, roles, invitations and billing for your B2B SaaS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}

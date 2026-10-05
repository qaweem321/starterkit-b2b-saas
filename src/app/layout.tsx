import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeSync } from "@/components/theme";
import { themeScript } from "@/lib/theme";
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}

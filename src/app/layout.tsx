import type { ReactNode } from "react";

export const metadata = {
  title: "SaaS Starter Kit",
  description: "A B2B SaaS starter kit",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

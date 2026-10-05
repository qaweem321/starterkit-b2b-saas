// Rebrand the app here: these values are used in page titles, the landing page and emails.
export const siteConfig = {
  name: "StarterKit",
  tagline: "B2B SaaS starter kit",
  description: "Teams, roles, invitations and billing for your B2B SaaS.",
};

// Builds a full link like "https://yourapp.com/invite/abc". Server-only: it reads BETTER_AUTH_URL.
export function absoluteUrl(path: string) {
  return `${process.env.BETTER_AUTH_URL}${path}`;
}

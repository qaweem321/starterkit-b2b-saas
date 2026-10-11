# Changelog

Notable changes for buyers of the kit. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] - 2026-10-10

First public version.

### Accounts
- Email and password sign-up with email verification, log in, forgot and reset password.
- Account page: change name and password, light/dark/system theme, delete account
  (organizations where you're the only member are deleted with it).
- After logging in you return to the page you asked for, or your last-used organization;
  people in several organizations choose one on a new device.
- Logged-in visitors skip the login and sign-up pages, and the back button never shows
  pages from before logging in or out.

### Organizations
- Multi-tenant workspaces at `/dashboard/<organization>`, onboarding for new users.
- Owner, admin and member roles with permissions in one file.
- Email invitations (7 days, single use), change roles, remove members, Free plan member limit
  (expired invitations don't take a seat).
- Rename, leave and delete an organization (blocked while its subscription would still charge,
  also after a failed payment).

### Billing
- One Pro plan per organization with Polar or Stripe (`BILLING_PROVIDER`), checkout,
  customer portal and webhooks; optional free trial.
- Billing page shows both plans; warnings for failed payments; never a second subscription.
- Billing page shows when the trial ends, when Pro renews, or that a cancelled subscription
  keeps Pro until the period ends and then returns to Free.
- Checkout pre-fills the payer's email (they can still change it).
- Polar: each subscription is linked to its organization (metadata), so one person can pay for
  several organizations with the same email; webhooks use the `subscription.*` events.

### Product
- Demo mode (`DEMO_MODE="true"`) for a public demo without a domain: no emails or
  verification, invite links shown on screen, a banner with test-card instructions and a
  reminder to enter your own email at checkout, and the test card (with a Copy button) next
  to "Upgrade to Pro".
- Landing page with features and pricing, Terms and Privacy templates.
- Dashboard with sidebar, mobile menu, user menu, loading skeletons, error and 404 pages.
- Example Projects feature to copy for your own features.
- Transactional emails with Resend (printed in the terminal without a key).
- SEO: generated preview image, sitemap, robots.txt, favicon, page titles.

### Quality and security
- One place to rebrand (`src/config/site.ts`); environment variables checked at startup.
- Security headers, database-backed rate limits for login and emails, and at most 20
  invitation emails per organization per hour (stops the app being used for spam); limits on
  creating organizations and projects.
- Names are checked on the server (length, no line breaks), since they appear in emails.
- Redirects after login only go to pages on your own site, even with hidden characters
  in the link.
- Email addresses are checked with a length limit and a pattern that can't be slowed down
  by huge fake input; CI installs packages without running their install scripts.
- Confirmation on destructive actions, no double submits, clear dates ("Oct 11, 2026").
- Friendly inline messages for every form mistake (never an error page), including clear
  wording for a wrong current password. In demo mode, "Forgot password" explains that emails
  are off instead of promising a link.
- Next.js 16.4 (latest security fixes).
- TypeScript strict mode, Biome lint and format, unit tests, GitHub Actions CI,
  `npm run check` for everything at once.

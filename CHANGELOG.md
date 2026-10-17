# Changelog

Notable changes for buyers of the kit. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Runs on any Postgres, not only Neon: Neon's HTTP driver for `*.neon.tech` addresses, a normal
  connection (postgres.js) for everything else, or choose with `DATABASE_DRIVER`. Related
  writes go through `atomic()` (`src/db/atomic.ts`), which works with both.
- Docker: `Dockerfile` and `docker-compose.yml` run the app with its own Postgres (migrations on
  every start), plus `deploy/Caddyfile` for automatic HTTPS. See "Deploy option B" in the README.

### Fixed
- The Billing page no longer says "Renews on ..." for a subscription that has ended
  (`canceled`, `incomplete_expired`): only an active or trialing Pro plan shows a date.

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
- The "Log in" / "Sign up" links keep where you were going (for example an invitation).

### Organizations
- Multi-tenant workspaces at `/dashboard/<organization>`, onboarding for new users.
- Owner, admin and member roles with permissions in one file.
- Email invitations (7 days, single use), change roles, remove members, Free plan member limit
  (expired invitations don't take a seat).
- An organization always keeps an owner, also when two owners remove or demote each other at
  the same moment.
- Rename, leave and delete an organization (blocked while its subscription would still charge,
  also after a failed payment).

### Billing
- One Pro plan per organization with Polar or Stripe (`BILLING_PROVIDER`), checkout,
  customer portal and webhooks; optional free trial.
- Billing page shows both plans; warnings for failed payments (and Stripe's paused
  subscriptions) that say what happened, with no "Renews on" next to them.
- Never a second subscription: checkout asks Polar or Stripe for the live subscription first,
  and Stripe closes the organization's other open checkout pages.
- Billing page shows when the trial ends, when Pro renews, or that a cancelled subscription
  keeps Pro until the period ends and then returns to Free.
- Stripe's free trial is for an organization's first subscription only.
- Checkout pre-fills the payer's email (they can still change it).
- Polar's billing portal opens only for the person who pays (it shows all of their
  subscriptions, also for other organizations); other owners are told who to ask.
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
- Security headers, database-backed rate limits for login (per IP address and per account)
  and emails, and at most 20 invitation emails per organization and 30 per person per hour
  (stops the app being used for spam); limits on creating organizations and projects.
- An error page also when the root layout fails (`global-error.tsx`).
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

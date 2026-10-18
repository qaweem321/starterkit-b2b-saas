# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, ...) working on this project.
Humans: start with README.md.

## The project

A B2B SaaS **starter** kit: Next.js 16 App Router, React 19, TypeScript (strict), Tailwind 4,
Drizzle ORM on Postgres (Neon over HTTP, or any Postgres), Better Auth, Polar or Stripe billing, Resend emails, Biome.

Keep the code small, readable and easy to change: when adding a feature, follow the existing
patterns below rather than adding new layers of abstraction.

## Next.js 16 is newer than your training data

Read the docs that ship with the package before using a Next.js API:
`node_modules/next/dist/docs/`. For example: `middleware` is now `proxy` (`src/proxy.ts`),
`next lint` is gone (we use Biome), `params` and `headers()` are async.

## Commands

- `npm run check`: typecheck + lint + tests + production build. **Must pass before every commit.**
- `npm run format`: fix formatting and import order (Biome).
- `npm test`: unit tests (`node:test` via tsx, files named `*.test.ts` next to the code).
- After changing `src/db/schema.ts`: `npm run db:generate`, then `npm run db:migrate`.

## Where things live

- `src/app/dashboard/[slug]/`: everything inside an organization. `src/app/dashboard/page.tsx`
  picks which organization to open.
- `src/lib/session.ts`: `requireUser`, `requireMembership(slug)`, `requirePermission(slug, perm)`.
- `src/lib/permissions.ts`: the only place roles and permissions are defined (`can(role, perm)`).
- `src/lib/owners.ts`: remove members or change roles only through `removeMembershipKeepingOwner`
  / `changeRoleKeepingOwner`, so an organization can never lose its last owner.
- `src/lib/billing/`: provider interface (`types.ts`), Polar and Stripe, plans and statuses.
  Billing is per organization: Polar subscriptions carry `organizationId` in metadata (Polar has
  one customer per email); Stripe has one customer per organization.
- `src/db/index.ts`: picks the driver (`src/db/driver.ts`): Neon HTTP or postgres.js. Write
  several related changes with `atomic((tx) => [...])` (`src/db/atomic.ts`), never `db.batch`
  or `db.transaction` directly, so both drivers work. In raw `sql` templates pass dates as
  ISO strings (`date.toISOString()`): postgres.js rejects a `Date` there.
- Self-hosting: `Dockerfile`, `docker-compose.yml`, `deploy/Caddyfile`. Scripts load `.env` only
  if it exists (`src/db/load-env.ts`) and must call `closeDb()` when done.
- `src/lib/env.ts`: environment checks at startup (`src/instrumentation.ts`).
- `src/lib/demo.ts`: `isDemoMode()` (`DEMO_MODE="true"`): no emails, no verification, banner.
  Anything new that sends email needs a demo-mode path (see invitations).
- `src/proxy.ts`: logged-out redirect with `?next=`, last-used organization cookie.
- `src/config/site.ts`: name, branding, `absoluteUrl()`.
- `src/components/ui/`: `Button`/`ButtonLink` (variants), `Input`/`Select`, `SubmitButton`,
  `Skeleton`. Shared pieces: `PlanCard`, `Logo`, `UserMenu`, `PaymentProblemNotice`.

## Rules

**Security and data**
- Every server action and page starts with `requireMembership` or `requirePermission`. Never
  trust IDs or roles sent by the browser.
- Every query on organization data filters by `organizationId` (see
  `src/app/dashboard/[slug]/projects/actions.ts`, the reference feature).
- Validate and trim all input on the server. Compare emails in lowercase and check them with
  `isValidEmail()` (`src/lib/email-address.ts`). Avoid regexes that can backtrack heavily.
- Redirects to user-supplied paths go through `safeNextPath()`.
- Anything that sends email or can be repeated cheaply gets a limit: `rateLimit(key, max,
  windowSeconds)` from `src/lib/rate-limit.ts`.
- New environment variables: add them to `.env.example` and to `checkEnv()` in `src/lib/env.ts`.

**Speed**
- The database is a network call away. Run independent queries with `Promise.all`, never query
  inside a loop (group or join instead), and avoid extra round trips. Use a cookie check
  (`getSessionCookie`) instead of a database session lookup where that's enough.

**UI**
- Use the semantic color tokens (`bg-background`, `text-muted-foreground`, `border-border`,
  `text-danger`, ...) so dark mode works. Don't use raw `gray-*` colors.
- Reuse `src/components/ui` instead of styling new buttons and inputs.
- Submit buttons: `SubmitButton` (disabled while sending), with `confirm` for destructive actions.
- Form actions return user mistakes as state for `useActionState` (`{ error }`), shown next to
  the form. Only `throw` for things the UI never allows (tampered requests).
- Dates: `formatDate()` from `src/lib/format.ts`. A sentence ending in a name someone typed:
  `endSentence(name)` (no "Acme Inc..").
- Give icon-only buttons an `aria-label`, mark decorative SVGs `aria-hidden="true"`.
- After logging in or out, use a full page load (`window.location.replace`), not the router.

**Code style**
- Small, single-purpose files. Shared logic goes in `src/lib`, shared UI in `src/components`.
- Short comments that explain *why*, in plain English.
- Add or update unit tests for logic in `src/lib`.

## Keep the docs in sync (every change)

In the **same commit** as a code change, update whatever it affects:
- `README.md`: features list, setup steps, environment variables, scripts.
- `AGENTS.md`: new conventions, folders or rules.
- `.env.example`: new or changed variables.
- `src/app/privacy/page.tsx`: if the app starts storing new personal data.

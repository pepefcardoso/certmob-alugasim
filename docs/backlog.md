# RentEasy — MVP Backlog

Scope: property + contract registration, rent adjustment calculator (IGP-M/IPCA/INPC), payment status dashboard, email reminders, basic reports, LGPD/legal baseline. No e-signature, PIX/boleto, WhatsApp, inspections, NFS-e, multi-user/RBAC.

## Conventions

- **ID format:** `P<phase>.<task>` (e.g. `P2.3`)
- **Size:** S (≤2h), M (half day), L (full day). Nothing bigger than L — if a task feels bigger, it should have been split.
- **Depends on:** task IDs that must be done first
- **DoD:** Definition of Done — the acceptance check, not a description
- Assumptions stated per-task are defaults, not requirements — override any of them before starting that task

## Stack fixed for this backlog

- Next.js (App Router), TypeScript, pnpm
- Prisma + PostgreSQL 16
- **Better Auth** (not Auth.js) — Auth.js/NextAuth v5 entered maintenance mode in early 2026 with development moved to Better Auth, which is now the actively maintained option with a native Prisma adapter
- shadcn/ui (`npx shadcn@latest init`, Next.js template) + Tailwind
- Resend for transactional email
- BCB SGS API for index values (public, no auth key needed)
- Vitest + React Testing Library, Playwright
- GitHub Actions, Docker, docker-compose

---

## Phase 0 — Repo & Tooling Scaffold

### P0.1 — Initialize Next.js project - DONE

- **Size:** S
- **Depends on:** —
- **Description:** `pnpm create next-app@latest` with TypeScript, App Router, ESLint, Tailwind, `src/` directory, import alias `@/*`.
- **DoD:** `pnpm dev` serves the default page at `localhost:3000`; `pnpm build` succeeds.

### P0.2 — Configure ESLint + Prettier - DONE

- **Size:** S
- **Depends on:** P0.1
- **Description:** Add Prettier with `eslint-config-prettier` to avoid rule conflicts. Add `.prettierrc`, `.editorconfig`. Add `lint` and `format` scripts to `package.json`.
- **DoD:** `pnpm lint` and `pnpm format --check` both run clean on the scaffold.

### P0.3 — Install and initialize shadcn/ui - DONE

- **Size:** S
- **Depends on:** P0.1
- **Description:** `npx shadcn@latest init` with Next.js template. Add `button`, `input`, `label`, `card`, `table`, `dialog`, `form`, `select`, `badge`, `toast`/`sonner` components.
- **DoD:** A shadcn `Button` renders correctly on the home page; `components/ui/*` exists.

### P0.4 — Environment variable scaffolding - DONE

- **Size:** S
- **Depends on:** P0.1
- **Description:** Create `.env.example` with placeholders for: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `EMAIL_FROM`. Add `.env` to `.gitignore` (keep `.env.example` tracked). Add a `src/lib/env.ts` that validates required env vars at boot using `zod` (fail fast with a clear error instead of a runtime crash later).
- **DoD:** Removing a required var from `.env` and running `pnpm dev` throws a readable startup error naming the missing var.

### P0.5 — Dockerfile (multi-stage) - DONE

- **Size:** M
- **Depends on:** P0.1
- **Description:** Multi-stage Dockerfile: `deps` (install), `builder` (build with `output: 'standalone'` in `next.config.ts`), `runner` (copy standalone output, run as non-root user, expose port 3000).
- **DoD:** `docker build -t renteasy .` succeeds; `docker run -p 3000:3000 renteasy` serves the app (with a reachable `DATABASE_URL`).

### P0.6 — docker-compose for local dev - DONE

- **Size:** M
- **Depends on:** P0.5
- **Description:** Services: `app` (build from Dockerfile, or run `pnpm dev` mounted for hot reload — prefer the latter for local dev), `postgres:16` (named volume, healthcheck), `mailhog` (SMTP catcher on 8025 for local email preview, used only as a Resend fallback in dev — see P8.1). `.env` wired via `env_file`.
- **DoD:** `docker compose up` gives a working app + reachable Postgres on the configured port; `docker compose down -v` cleans up.

### P0.7 — GitHub Actions CI skeleton - DONE

- **Size:** M
- **Depends on:** P0.2
- **Description:** `.github/workflows/ci.yml` with jobs: `lint`, `typecheck` (`tsc --noEmit`), `test` (placeholder, no tests yet), `build`. Trigger on PR and push to `main`. Use pnpm cache action.
- **DoD:** Pushing a branch with a lint error fails the `lint` job; a clean branch passes all jobs green.

---

## Phase 1 — Database & Schema

### P1.1 — Install Prisma and connect to Postgres - DONE

- **Size:** S
- **Depends on:** P0.6
- **Description:** `pnpm add -D prisma`, `pnpm add @prisma/client`, `npx prisma init`. Point `DATABASE_URL` at the compose Postgres service.
- **DoD:** `npx prisma db pull` (or a trivial query script) connects successfully.

### P1.2 — Define `User` model - DONE

- **Size:** S
- **Depends on:** P1.1
- **Description:** Fields: `id` (cuid), `email` (unique), `name`, `personType` (enum `PF`/`PJ`), `document` (CPF or CNPJ, string, unique), `createdAt`, `updatedAt`. Auth-related fields (password hash, sessions) are added by Better Auth's own schema in P2.1 — don't duplicate them here.
- **DoD:** `prisma format` and `prisma validate` pass.

### P1.3 — Define `Property` model - DONE

- **Size:** S
- **Depends on:** P1.2
- **Description:** Fields: `id`, `ownerId` (FK → User), `label` (free-text nickname), `addressStreet`, `addressNumber`, `addressComplement` (nullable), `addressNeighborhood`, `addressCity`, `addressState` (2-letter UF), `addressZip`, `createdAt`, `updatedAt`.
- **DoD:** Migration generated without errors; `Property.ownerId` has an index.

### P1.4 — Define `Tenant` model - DONE

- **Size:** S
- **Depends on:** P1.2
- **Description:** Fields: `id`, `ownerId` (FK → User — tenant records belong to the landlord, tenant has no login), `name`, `document` (CPF, nullable), `email`, `phone` (nullable), `createdAt`, `updatedAt`. No password/auth fields — this entity is a contact record, not an account.
- **DoD:** Migration generated; `email` is required (used for reminders in P6).

### P1.5 — Define `Contract` model - DONE

- **Size:** M
- **Depends on:** P1.3, P1.4
- **Description:** Fields: `id`, `propertyId` (FK), `tenantId` (FK), `rentValue` (Decimal, current value), `adjustmentIndex` (enum `IGPM`/`IPCA`/`INPC`), `baseDate` (Date — contract anniversary used for adjustment eligibility), `startDate`, `endDate` (nullable), `status` (enum `ACTIVE`/`ENDED`), `createdAt`, `updatedAt`. Use Prisma `Decimal` type for `rentValue`, never `Float` — this is currency.
- **DoD:** Migration generated; a seed script (P1.7) can create one valid contract without constraint errors.

### P1.6 — Define `RentAdjustment` and `Payment` models - DONE

- **Size:** M
- **Depends on:** P1.5
- **Description:**
  - `RentAdjustment`: `id`, `contractId` (FK), `indexUsed` (enum, same values as `Contract.adjustmentIndex`), `indexRatePercent` (Decimal — the accumulated 12-month rate applied), `previousValue` (Decimal), `newValue` (Decimal), `referenceDate` (Date — the contract-anniversary date this adjustment corresponds to), `appliedAt` (DateTime — when the owner actually applied it, may differ from `referenceDate`), `createdAt`.
  - `Payment`: `id`, `contractId` (FK), `dueDate` (Date), `amount` (Decimal), `status` (enum `UPCOMING`/`PAID`/`LATE`), `paidAt` (DateTime, nullable), `createdAt`, `updatedAt`. Add a unique constraint on `(contractId, dueDate)` so the generator (P7) can't create duplicate periods.
- **DoD:** Migrations generated; unique constraint verified by attempting a duplicate insert in a scratch script and confirming it's rejected.

### P1.7 — Seed script - DONE

- **Size:** M
- **Depends on:** P1.6
- **Description:** `prisma/seed.ts`: one demo `User`, 2 `Property`, 2 `Tenant`, 2 `Contract` (one with a `baseDate` >12 months ago to test adjustment eligibility, one recent), a handful of `Payment` rows spanning paid/upcoming/late. Wire into `package.json` `prisma.seed`.
- **DoD:** `npx prisma db seed` runs idempotently (safe to re-run) and populates all tables.

## Phase 2 — Auth

### P2.1 — Install and configure Better Auth - DONE

- **Size:** M
- **Depends on:** P1.2
- **Description:** `pnpm add better-auth`. Configure the Prisma adapter against the `User` model from P1.2 (Better Auth will extend it with its own session/account tables via its own migration — run that migration and reconcile with the schema from Phase 1). Email + password provider only for MVP (no OAuth, no magic link). Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` from env.
- **DoD:** A test script can create a user via Better Auth's server API and retrieve a session.

### P2.2 — Auth route handlers + server helpers - DONE

- **Size:** S
- **Depends on:** P2.1
- **Description:** Mount Better Auth's route handler at `src/app/api/auth/[...all]/route.ts`. Add `src/lib/auth.ts` exporting a `getSession()` server helper for use in Server Components/Actions.
- **DoD:** `POST /api/auth/sign-up/email` and `POST /api/auth/sign-in/email` work via curl/Postman against local dev.

### P2.3 — Sign-up and sign-in pages - DONE

- **Size:** M
- **Depends on:** P2.2, P0.3
- **Description:** `/sign-up` (email, password, name, personType, document) and `/sign-in` (email, password) using shadcn `Form` + `Input`. Client-side validation with `zod` + `react-hook-form`. On success, redirect to `/dashboard`.
- **DoD:** Manual signup → redirected to dashboard → sign out → sign back in works end to end in the browser.

### P2.4 — Route protection (Data Access Layer pattern) - DONE

- **Size:** M
- **Depends on:** P2.3
- **Description:** Do **not** rely on middleware alone for auth protection (Next.js middleware can be bypassed via header spoofing — CVE-2025-29927; middleware should redirect for UX but is not a security boundary). Instead, every Server Action and data-fetching function under `/dashboard/*` must call `getSession()` and throw/redirect if absent — centralize this in a `requireSession()` helper in `src/lib/auth.ts` and use it at the top of every protected Server Action and Server Component data fetch.
- **DoD:** Directly requesting a protected Server Action with a forged/absent cookie (test via a script bypassing the browser) is rejected, not just the page redirect.

### P2.5 — Basic profile page - DONE

- **Size:** S
- **Depends on:** P2.4
- **Description:** `/dashboard/profile` — view/edit `name`, `personType`, `document`. No password change flow yet (out of MVP scope unless requested).
- **DoD:** Editing and saving updates the `User` row and reflects on reload.

---

## Phase 3 — Core CRUD: Property

### P3.1 — Property list page - DONE

- **Size:** M
- **Depends on:** P2.4, P1.7
- **Description:** `/dashboard/properties` — table (shadcn `Table`) of the logged-in owner's properties (label, address summary, contract count). Empty state with a CTA when zero properties.
- **DoD:** Seeded properties render for the seeded user; a second test user sees zero (ownership scoping verified).

### P3.2 — Create/edit Property form - DONE

- **Size:** M
- **Depends on:** P3.1
- **Description:** shadcn `Dialog` or dedicated route with `react-hook-form` + `zod` schema matching P1.3 fields. Server Action for create and update, scoped to `requireSession().user.id`.
- **DoD:** Creating a property with invalid ZIP format shows a field-level error; valid submission appears in the list without a full page reload.

### P3.3 — Delete Property (soft guard) - DONE

- **Size:** S
- **Depends on:** P3.2
- **Description:** Delete action with a confirmation dialog. Block deletion (return a clear error) if the property has any linked `Contract` — don't cascade-delete rent/payment history.
- **DoD:** Deleting a property with zero contracts succeeds; deleting one with a contract returns a blocking error message, not a silent failure or crash.

---

## Phase 4 — Core CRUD: Tenant

### P4.1 — Tenant list + create/edit form - DONE

- **Size:** M
- **Depends on:** P2.4
- **Description:** `/dashboard/tenants` — same pattern as P3.1/P3.2 for the `Tenant` model. Email field required and validated.
- **DoD:** CRUD works end to end; ownership scoping verified with a second test user.

### P4.2 — Delete Tenant (soft guard) - DONE

- **Size:** S
- **Depends on:** P4.1
- **Description:** Same guard pattern as P3.3 — block delete if linked to any `Contract`.
- **DoD:** Same as P3.3, applied to Tenant.

---

## Phase 5 — Core CRUD: Contract

### P5.1 — Contract list page - DONE

- **Size:** M
- **Depends on:** P3.1, P4.1
- **Description:** `/dashboard/contracts` — table showing property label, tenant name, current rent value, adjustment index, status. Filter by status (Active/Ended).
- **DoD:** Seeded contracts render correctly joined with property/tenant names.

### P5.2 — Create Contract form - DONE

- **Size:** L
- **Depends on:** P5.1
- **Description:** Form fields per P1.5. Property and Tenant selected via searchable `Select` (must belong to the same owner — filter the query options server-side, not just client-side). `baseDate` and `startDate` via shadcn date picker. Server Action validates: `endDate` (if set) is after `startDate`; `rentValue` > 0.
- **DoD:** Submitting with a tenant belonging to a _different_ owner is rejected server-side even if the client were tampered with (test by crafting the request manually).

### P5.3 — Contract detail page - DONE

- **Size:** M
- **Depends on:** P5.2
- **Description:** `/dashboard/contracts/[id]` — shows contract terms, linked property/tenant, adjustment history (empty for now, wired in P6), payment history (empty for now, wired in P7). This page is the anchor the later phases attach their sections to.
- **DoD:** Navigating from the list to a contract's detail page shows correct data; a contract ID belonging to another owner returns 404, not the data.

### P5.4 — Edit / end Contract - DONE

- **Size:** S
- **Depends on:** P5.3
- **Description:** Edit form (reuse P5.2's fields except `rentValue`, which should only change via the adjustment flow in P6 — not manually edited here, to keep `RentAdjustment` history authoritative). Add an "End contract" action that sets `status = ENDED` and `endDate`.
- **DoD:** Attempting to edit `rentValue` directly from this form is not possible (field absent or read-only); ending a contract updates status and is reflected in the list filter.

---

## Phase 6 — Rent Adjustment Calculator

### P6.1 — BCB SGS API client - PARTIALLY DONE

- **Size:** M
- **Depends on:** P0.4
- **Description:** `src/lib/bcb.ts`. Series codes: IGP-M = `189`, INPC = `188`, IPCA = `433` (all monthly % variation series). Endpoint pattern: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.{codigo}/dados?formato=json&dataInicial={dd/MM/yyyy}&dataFinal={dd/MM/yyyy}`. No API key required. Function `getIndexMonthlyRates(index, startDate, endDate)` returns an array of `{ date, value }` monthly rates.
- **DoD:** Calling the function for IPCA over a known 12-month window returns 12 monthly values matching what's published on the BCB site (spot-check 2–3 values manually).

### P6.2 — Accumulated rate calculation + caching - PARTIALLY DONE

- **Size:** M
- **Depends on:** P6.1
- **Description:** `getAccumulated12MonthRate(index, referenceDate)` — compounds the 12 monthly rates ending at `referenceDate` (not simple sum: `(1+r1)*(1+r2)*...*(1+r12) - 1`). Cache results in a new `IndexRateCache` table (`index`, `referenceDate`, `accumulatedPercent`, `fetchedAt`) keyed by month, since BCB's published monthly value doesn't change after the month closes — avoid re-fetching on every page load.
- **DoD:** Two consecutive calls for the same `(index, referenceDate)` hit the cache on the second call (verify via a log line or call counter in a test), and the compounded value differs from a naive sum by a nonzero amount on the test data.

### P6.3 — Adjustment eligibility logic - PARTIALLY DONE

- **Size:** S
- **Depends on:** P5.3
- **Description:** `isAdjustmentEligible(contract)` — true if `today >= baseDate + 12 months` since the _last applied_ adjustment (or since `startDate` if none applied yet), per Lei 8.245/91's one-adjustment-per-12-months rule. Surface this as a badge/button state on the contract detail page, not a separate task.
- **DoD:** Unit test: a contract with `baseDate` 13 months ago and no prior `RentAdjustment` is eligible; one adjusted 2 months ago is not eligible again yet.

### P6.4 — "Apply adjustment" flow with visible math - PARTIALLY DONE

- **Size:** L
- **Depends on:** P6.2, P6.3
- **Description:** On the contract detail page, an "Apply adjustment" action (only enabled per P6.3) opens a preview showing: current rent, index name, accumulated rate %, calculated new rent, formula spelled out (e.g. "R$ 2.000,00 × (1 + 4,44%) = R$ 2.088,80") — this visibility is the core trust-building feature from the product spec, not optional polish. Confirming writes a `RentAdjustment` row and updates `Contract.rentValue` in a single transaction.
- **DoD:** Applying an adjustment updates both `RentAdjustment` history and `Contract.rentValue`; the preview math matches the persisted values exactly (assert in a test, not just visually).

### P6.5 — Adjustment history display - PARTIALLY DONE

- **Size:** S
- **Depends on:** P6.4
- **Description:** Wire the (previously empty) adjustment history section on the contract detail page (P5.3) to list `RentAdjustment` rows chronologically: date, index, rate, old → new value.
- **DoD:** After applying an adjustment in P6.4, it immediately appears in this list without a manual refresh.

---

## Phase 7 — Payments & Status Dashboard

### P7.1 — Payment generation on contract creation - PARTIALLY DONE

- **Size:** M
- **Depends on:** P5.2
- **Description:** When a `Contract` is created (or after an adjustment changes `rentValue`), generate `Payment` rows for the next 3 months (rolling — extended in P7.2), `dueDate` derived from `startDate`'s day-of-month, `amount` = current `rentValue`, `status = UPCOMING`.
- **DoD:** Creating a contract produces exactly 3 future `Payment` rows with correct due dates (test a `startDate` on the 31st against a 30-day month to confirm date math doesn't crash).

### P7.2 — Scheduled payment generation job

- **Size:** M
- **Depends on:** P7.1
- **Description:** `src/app/api/jobs/generate-payments/route.ts` — a route handler (called by the cron container from P0.6's compose or an external scheduler) that, for every `ACTIVE` contract, ensures the next 3 months of `Payment` rows exist (idempotent — relies on the `(contractId, dueDate)` unique constraint from P1.6 to skip duplicates).
- **DoD:** Calling the route twice in a row doesn't create duplicate payments; calling it after a month has passed extends the rolling window by the expected new row.

### P7.3 — Payment status auto-update (late detection)

- **Size:** S
- **Depends on:** P7.2
- **Description:** Same or a sibling job route: any `Payment` with `status = UPCOMING` and `dueDate < today` flips to `LATE`. Run on the same schedule as P7.2.
- **DoD:** A seeded payment with a past due date and `UPCOMING` status flips to `LATE` after the job runs.

### P7.4 — Mark payment as paid

- **Size:** S
- **Depends on:** P7.1
- **Description:** Action on the contract detail page's payment list (and/or dashboard) to mark a `Payment` as `PAID`, setting `paidAt`. Manual only for MVP — no gateway.
- **DoD:** Marking paid updates status and `paidAt`, removes it from any "late/upcoming" counts used in P7.5.

### P7.5 — Dashboard: payment status overview

- **Size:** M
- **Depends on:** P7.3, P7.4
- **Description:** `/dashboard` — cards/list across all the owner's contracts: color-coded by status (green=paid, yellow=upcoming, red=late), matching the product spec's dashboard concept. Sort late items first.
- **DoD:** Seeded data with a mix of statuses renders with correct colors/ordering; a paid item shown after P7.4 no longer shows as late.

---

## Phase 8 — Email Reminders

### P8.1 — Resend integration + dev fallback

- **Size:** S
- **Depends on:** P0.4, P0.6
- **Description:** `src/lib/email.ts` wrapping Resend's SDK. In `development`, if `RESEND_API_KEY` is unset, fall back to SMTP against the Mailhog container from P0.6 instead of failing — keeps local dev usable without a real API key.
- **DoD:** Sending a test email in dev with no `RESEND_API_KEY` appears in Mailhog's UI (`localhost:8025`).

### P8.2 — Reminder email template

- **Size:** S
- **Depends on:** P8.1
- **Description:** A single React Email (or plain HTML) template: tenant name, property address, amount due, due date. Written in Portuguese (product's market is Brazil).
- **DoD:** Rendering the template with seed data produces a legible email in Mailhog.

### P8.3 — Reminder job (3-day-out due payments)

- **Size:** M
- **Depends on:** P8.2, P7.2
- **Description:** `src/app/api/jobs/send-reminders/route.ts` — finds `Payment` rows with `status = UPCOMING` and `dueDate` exactly 3 days out, sends the P8.2 template to the linked `Tenant.email`. Add a `reminderSentAt` column to `Payment` (migration) and skip rows where it's already set, so re-running the job doesn't double-send.
- **DoD:** Running the job against a seeded payment due in exactly 3 days sends one email and sets `reminderSentAt`; running it again sends zero additional emails for that row.

### P8.4 — Cron container wiring

- **Size:** S
- **Depends on:** P7.2, P7.3, P8.3
- **Description:** Add a lightweight scheduler service to `docker-compose.yml` (e.g. `ofelia` or a bare `cron` image) that calls the three job routes (`generate-payments`, then the late-detection route, then `send-reminders`, in that order) once daily.
- **DoD:** `docker compose up` runs all three jobs on schedule without manual triggering; verified by checking logs/Mailhog after the scheduled time in a local test.

---

## Phase 9 — Reports

### P9.1 — Monthly revenue report

- **Size:** M
- **Depends on:** P7.5
- **Description:** `/dashboard/reports` — sum of `PAID` payments per calendar month across all the owner's contracts, last 12 months, as a simple table (chart is a nice-to-have, not required for MVP).
- **DoD:** Seeded paid payments across 2+ months produce correct per-month sums.

### P9.2 — Delinquency rate

- **Size:** S
- **Depends on:** P9.1
- **Description:** On the same page: `LATE` payments ÷ total `Payment` rows due in the period, as a percentage, for the current month and trailing 3 months.
- **DoD:** Matches a manually-computed value against seed data.

### P9.3 — Monthly income export (carnê-leão support)

- **Size:** M
- **Depends on:** P9.1
- **Description:** CSV export button on the reports page: one row per `PAID` payment in the selected period (date, property address, tenant name, amount). This is the "monthly income report per owner" compliance item — doesn't need to be a formatted PDF for MVP, a clean CSV the owner or their accountant can use is sufficient.
- **DoD:** Downloaded CSV opens correctly in a spreadsheet app and matches on-screen totals.

---

## Phase 10 — LGPD / Legal Baseline

### P10.1 — Privacy Policy and Terms of Use pages

- **Size:** M
- **Depends on:** —
- **Description:** Static `/privacy` and `/terms` routes. Content should cover (per the LGPD doc's structure): controller identity, data collected, purposes, legal basis (contract execution — Art. 7º V), sharing, retention periods, data subject rights, security measures, DPO contact. **This is legal content — draft it with a lawyer or the source `lgpd.md`/`legal.md` docs, don't ship AI-generated legal text as-is.**
- **DoD:** Both pages are reachable, linked from the sign-up page (checkbox acknowledgment) and site footer.

### P10.2 — Data subject rights request form

- **Size:** M
- **Depends on:** P10.1
- **Description:** `/privacy/request` — a simple authenticated form (access, correction, deletion, portability request types) that stores the request in a new `PrivacyRequest` table (`userId`, `type`, `details`, `status`, `createdAt`) and emails the DPO address. Manual processing is fine for MVP — no automation required yet.
- **DoD:** Submitting a request creates a DB row and triggers an email to the configured DPO address.

### P10.3 — HTTPS and transport security (deployment task)

- **Size:** S
- **Depends on:** P0.5
- **Description:** Not app code — a deployment note/config: reverse proxy (Caddy or Traefik) in front of the app container with automatic Let's Encrypt TLS, HTTP→HTTPS redirect. Document this in `DEPLOYMENT.md`.
- **DoD:** Production compose/deployment config enforces HTTPS; documented steps are reproducible by someone else on the team.

### P10.4 — Encryption at rest (deployment task)

- **Size:** S
- **Depends on:** P0.6
- **Description:** Also a deployment note, not app code: confirm the production Postgres host/volume has disk-level encryption enabled (most managed Postgres providers do this by default — verify and document which setting/provider flag confirms it, rather than implementing app-level column encryption for MVP).
- **DoD:** `DEPLOYMENT.md` states which provider setting satisfies this and how it was verified.

---

## Phase 11 — Testing & CI/CD Hardening

### P11.1 — Unit tests: adjustment calculation

- **Size:** M
- **Depends on:** P6.4
- **Description:** Vitest tests for `getAccumulated12MonthRate` (P6.2) and `isAdjustmentEligible` (P6.3) — these are the financial-correctness-critical functions in the whole product. Cover: compounding vs. naive sum, exact 12-month boundary, leap-year date math.
- **DoD:** ≥90% branch coverage on these two functions specifically; all tests pass in CI.

### P11.2 — Unit tests: payment generation and status transitions

- **Size:** M
- **Depends on:** P7.3
- **Description:** Tests for P7.1/P7.2/P7.3 logic: rolling window generation, idempotency (no duplicates on re-run), late-flip boundary condition.
- **DoD:** Tests pass in CI; re-running the generation logic twice in a test asserts row count is unchanged.

### P11.3 — Component tests: Contract form validation

- **Size:** M
- **Depends on:** P5.2
- **Description:** RTL tests for the contract form's client-side validation rules (P5.2) and the cross-owner rejection behavior (mocked).
- **DoD:** Tests pass in CI.

### P11.4 — E2E happy path

- **Size:** L
- **Depends on:** P9.2, P8.4
- **Description:** Playwright: sign up → create property → create tenant → create contract → apply adjustment (assert visible math) → mark a payment paid → see it reflected on the dashboard and reports page. One test file, run against the docker-compose stack.
- **DoD:** Runs green locally and in CI against a fresh seeded database.

### P11.5 — Wire tests into CI

- **Size:** S
- **Depends on:** P11.1, P11.2, P11.3, P0.7
- **Description:** Update `ci.yml`'s `test` job to actually run `vitest run` and (on a separate job, since it needs the full stack) Playwright against a docker-compose service in CI.
- **DoD:** A deliberately broken test fails the PR check; a clean PR passes.

### P11.6 — Docker build + push in CI

- **Size:** S
- **Depends on:** P0.5, P11.5
- **Description:** On merge to `main`, build the Docker image and push to the chosen registry (GHCR is the default fit for a GitHub-hosted repo — confirm registry choice before implementing).
- **DoD:** A merge to `main` produces a new image tag in the registry, visible and pullable.

---

<!-- AGENTS.md -->

# Alugasim — Agent Instructions

## Project

Alugasim is a SaaS for small Brazilian property owners (PF/PJ, 1–10 imóveis) who self-manage rentals without an agency. Core value: automatic rent-adjustment calculation (IGP-M/IPCA/INPC) with visible math, payment status tracking, email reminders. Full brief: `docs/concept-idea.md`, `docs/roadmap.md`.

## Stack (fixed — do not swap without discussion)

- Next.js (App Router) + TypeScript, pnpm
- Prisma + PostgreSQL 16
- **Better Auth** — not Auth.js/NextAuth (NextAuth v5 is in maintenance mode as of early 2026, Better Auth has the actively maintained Prisma adapter)
- shadcn/ui + Tailwind
- Resend (email); dev falls back to Mailhog SMTP when `RESEND_API_KEY` is unset
- BCB SGS public API for index rates (IGP-M=189, IPCA=433, INPC=188), no auth key
- Vitest + React Testing Library, Playwright
- GitHub Actions, Docker, docker-compose

## Commands

- `pnpm dev` / `pnpm build`
- `pnpm lint` / `pnpm format --check`
- `pnpm test` (vitest run) / `pnpm test:e2e` (playwright)
- `npx prisma migrate dev` / `npx prisma db seed`
- `docker compose up` / `docker compose down -v`

## Architecture rules

- **Auth boundary is the Data Access Layer, not middleware.** Next.js middleware can be bypassed (CVE-2025-29927). Every protected Server Action / data fetch must call `requireSession()` from `src/lib/auth.ts` — never rely on middleware redirect alone.
- **Ownership scoping is server-side, always.** Filter by `requireSession().user.id` in the query itself. Cross-owner access must be rejected server-side even if the client is tampered with.
- **Currency is `Decimal`, never `Float`** (`rentValue`, `amount`, rate percentages).
- **Rate compounding, not summation.** 12-month accumulated index = `(1+r1)*...*(1+r12) - 1`.
- **Rent changes only through the adjustment flow.** `Contract.rentValue` is never hand-edited — only written by the "apply adjustment" transaction alongside a `RentAdjustment` row, keeping history authoritative.
- **Show the math.** Adjustment UI must display the formula (old value × index % = new value), not just the result — this is the core trust mechanic, not cosmetic polish.
- **Soft-guard deletes.** Don't cascade-delete `Property`/`Tenant` rows with linked `Contract`s — block with a clear error.
- **Idempotent jobs.** Payment generation, late-detection, and reminder jobs must be safe to re-run (`(contractId, dueDate)` unique constraint, `reminderSentAt` guard).
- **User-facing copy is Portuguese** (market is Brazil).

## Legal/compliance

- Lei do Inquilinato (8.245/91): one rent adjustment per 12 months from contract anniversary/last adjustment — enforce via `isAdjustmentEligible()`, don't trust client input.
- LGPD baseline (privacy policy, terms, DPO contact, data-subject-rights request flow) is required from MVP. Don't ship AI-generated legal text as final copy for `/privacy` or `/terms` — draft against `docs/lgpd.md` and `docs/legal.md`, have a lawyer review.
- NFS-e/tax rules (`docs/fiscal.md`) are user-facing compliance info, not something the app files on the user's behalf for MVP.

## Docs

`docs/`: `concept-idea.md`, `roadmap.md`, `design.md`, `backlog.md`, `fiscal.md`, `legal.md`, `lgpd.md`, `reports.md`. `backlog.md` is the source of truth for scoped MVP tasks (phase/task IDs, DoD) — check it before assuming a feature is unscoped or already done.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

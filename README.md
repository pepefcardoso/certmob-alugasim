<!-- README.md -->

# RentEasy

SaaS for small Brazilian property owners (1–10 imóveis, PF/PJ) who self-manage rentals: rent-adjustment calculator (IGP-M/IPCA/INPC) with visible math, payment status dashboard, tenant email reminders. Full brief: `docs/concept-idea.md`.

## Stack

Next.js (App Router) · TypeScript · Prisma · PostgreSQL 16 · Better Auth · shadcn/ui · Tailwind · Resend · Vitest/Playwright

## Getting started

\`\`\`bash
pnpm install
cp .env.example .env # fill in values below
docker compose up -d postgres mailhog
npx prisma migrate dev
npx prisma db seed
pnpm dev
\`\`\`
Open <http://localhost:3000>.

## Environment variables

| Var                  | Purpose                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`       | Postgres connection string                                                 |
| `BETTER_AUTH_SECRET` | Better Auth session secret                                                 |
| `BETTER_AUTH_URL`    | Base URL Better Auth issues callbacks against                              |
| `RESEND_API_KEY`     | Transactional email; unset in dev falls back to Mailhog (`localhost:8025`) |
| `EMAIL_FROM`         | Sender address for reminders                                               |

## Scripts

| Command                             | Does                                               |
| ----------------------------------- | -------------------------------------------------- |
| `pnpm dev`                          | Dev server                                         |
| `pnpm build`                        | Production build                                   |
| `pnpm lint` / `pnpm format --check` | ESLint / Prettier check                            |
| `pnpm test`                         | Vitest unit/component tests                        |
| `pnpm test:e2e`                     | Playwright e2e (needs the docker-compose stack up) |
| `npx prisma migrate dev`            | Apply schema migrations                            |
| `npx prisma db seed`                | Seed demo data (idempotent)                        |

## Docker

`docker compose up` runs app + Postgres 16 + Mailhog + scheduled jobs (payment generation, late-detection, reminders). `docker compose down -v` tears down including volumes.

## Docs

Product/legal/market research: `docs/` (`roadmap.md`, `backlog.md`, `design.md`, `legal.md`, `lgpd.md`, `fiscal.md`, `reports.md`). `backlog.md` tracks MVP scope by phase.

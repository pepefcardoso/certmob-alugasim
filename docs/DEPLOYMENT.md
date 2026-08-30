<!-- DEPLOYMENT.md -->

# Deployment

RentEasy runs as a self-hosted project on the shared `pepefcardoso.dev` VPS. Stack-wide conventions (Traefik, ACME, backups, firewall) are in `VPS-ARCHITECTURE.md` at the infra repo root — this file covers only what's specific to RentEasy.

## Prerequisites

- Traefik stack already running on the VPS (`traefik-public` network exists, ACME resolver configured) — see `VPS-ARCHITECTURE.md` §4.
- DNS: add an `A` record `renteasy` → VPS IP, proxied, in Cloudflare (§2's "new subdomain workflow"). Do this before first deploy or the ACME HTTP-01 challenge will fail.
- `.env` on the VPS at the project root, built from `.env.production.example`, `chmod 600`, never committed.
- Update the Subdomain Map in `VPS-ARCHITECTURE.md` §9 once live.

## 1. HTTPS / Transport Security (P10.3)

Reverse proxy: **Traefik**, matching the existing VPS convention (label-based, no per-project Nginx/Caddy config, native Docker service discovery) — not introducing a second proxy technology for one project.

- TLS termination + cert issuance: Traefik's shared `letsencrypt` ACME resolver (HTTP-01 on port 80), configured once at the Traefik instance level. RentEasy only needs `tls.certresolver=letsencrypt` on its router label — no per-project ACME config.
- HTTP→HTTPS redirect: enforced globally by Traefik's `web` entrypoint (`--entrypoints.web.http.redirections.entrypoint.to=websecure`), already active for every project on this host. Nothing to add per-project.
- Security headers (HSTS, CSP, frame/XSS/sniffing protections): `renteasy-security-headers@file`, a RentEasy-specific middleware (see below) rather than the shared one used by `imobiliarias`/`portfolio`, since their CSP allow-lists don't match RentEasy's actual origins.

### Deploy steps

1. On the VPS: `git clone git@github.com:<org>/renteasy.git /root/projects/renteasy` (deploy key per §8 item 4).
2. Create `.env` from `.env.production.example`, fill in real secrets.
3. Append the `renteasy-security-headers` middleware block to `/root/traefik/dynamic/middlewares.yml` (Traefik's file provider watches this — no restart needed).
4. Run pending migrations against the target Postgres (see §2 in `docker-compose.prod.yml` — `postgres` isn't up yet on first run, so start it alone first):

docker compose -f docker-compose.prod.yml up -d postgres
docker run --rm --network <project>_db-internal --env-file .env node:22-alpine
sh -c "npm i -g prisma@7 && npx prisma migrate deploy"

(`prisma` is a devDependency and isn't in the standalone runtime image by design — run migrations as a one-off step, not baked into the app container's CMD.) 5. `docker compose -f docker-compose.prod.yml up -d --build` 6. `docker inspect --format='{{json .State.Health.Log}}' <app_container>` — confirm healthy before assuming the app is broken if the domain 404s (§8 item 3: Traefik silently drops unhealthy containers from routing).

### Verification

- `curl -I http://renteasy.pepefcardoso.dev` → expect `301` to `https://`.
- `curl -I https://renteasy.pepefcardoso.dev` → expect `200`, and `Strict-Transport-Security` header present.
- Confirm Cloudflare SSL/TLS mode is **Full (Strict)** for the zone (VPS-ARCHITECTURE.md §11) — Flexible mode would let Cloudflare↔origin traffic go unencrypted despite Traefik's cert.

## 2. Encryption at Rest (P10.4)

**Status: not currently satisfied at the disk level — documenting as a known gap, not a confirmed control.**

`docs/lgpd.md` assumes encryption at rest for the database is "already included" with cloud providers at no extra cost. That holds for managed Postgres (RDS, Cloud SQL, Supabase, Neon, etc.), which encrypt storage volumes by default. It does **not** hold here: RentEasy's Postgres is a self-hosted container (`postgres:16-alpine`, named volume `renteasy_postgres_data`) on a Contabo Core Cloud VPS 4 — a bare KVM instance, not a managed database product.

Checked Contabo's own documentation/blog for a disk-level encryption guarantee on Cloud VPS block storage: found none. Contabo markets "encrypted object storage" as a separate product (their S3-compatible offering), but nothing confirms the boot/data disk backing this VPS's volumes is encrypted at rest by default. Unlike the managed-provider case, there's no dashboard setting or provider flag to point to here — the honest answer is "unverified, and likely not encrypted."

**What is in place today:**

- Transport: HTTPS end-to-end (§1) and the internal `app`↔`postgres` link stays on the VPS's private Docker network (`db-internal`), never traverses the public internet.
- Offsite backups: nightly `pg_dumpall` → gzip → R2, per `VPS-ARCHITECTURE.md` §7. **Not yet encrypted before upload** — §11 flags this as a separate pending item (`gpg --symmetric --cipher-algo AES256` step in `backup.sh`); do that first since it protects the (bigger blast-radius) offsite copy for cheap.

**What is NOT in place:** encryption of the live Postgres volume on the VPS disk itself.

**Remediation options, for when this needs to move past "accepted risk":**

1. **Full-disk (LUKS) encryption on the VPS OS.** Correct fix, but requires reprovisioning the VPS from scratch (LUKS setup happens at install time) — disruptive, since `portfolio` and `imobiliarias` are already live on the same host. Would need to be scheduled as a maintenance window with a full restore-from-backup afterward.
2. **Migrate RentEasy's Postgres off the VPS to a managed provider** (Neon, Supabase, RDS) that encrypts at rest by default — sidesteps the reprovisioning disruption to the other two projects, at the cost of an external DB dependency and its own egress/latency tradeoffs.

**Decision for MVP:** accept the gap, ship P10.3/P10.4 as documented rather than blocked on either remediation option. Re-open before RentEasy handles real tenant/landlord PII at scale, or before any LGPD audit — `docs/lgpd.md` line 359's "Criptografar banco de dados (AES-256)" checklist item should stay unchecked until one of the two options above is actually done.

# /root/traefik/dynamic/middlewares.yml (append under http.middlewares)

    renteasy-security-headers:
      headers:
        frameDeny: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        customFrameOptionsValue: "SAMEORIGIN"
        contentSecurityPolicy: "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'"

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
ARG NEXT_PUBLIC_CALCOM_LINK=alugasim/demo
ARG NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=47999998888
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/alugasim?schema=public" \
    BETTER_AUTH_SECRET="build-time-placeholder" \
    BETTER_AUTH_URL="http://localhost:3000" \
    EMAIL_FROM="Alugasim <no-reply@alugasim.com.br>" \
    LEAD_NOTIFY_EMAIL="founder@alugasim.com.br" \
    CRON_SECRET="build-time-placeholder" \
    DPO_EMAIL="privacidade@alugasim.com.br" \
    NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL \
    NEXT_PUBLIC_CALCOM_LINK=$NEXT_PUBLIC_CALCOM_LINK \
    NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=$NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
# syntax=docker/dockerfile:1

# ASDRÉ — production image for the Next.js 16 app.
# Multi-stage build → tiny, non-root, standalone runtime.
# Node 22 satisfies Next.js 16's Node >= 20.9 requirement (host Node version
# no longer matters — the container brings its own).

ARG NODE_VERSION=22-alpine

# ---- deps: install dependencies only (best layer caching) -------------------
FROM node:${NODE_VERSION} AS deps
# Alpine is musl libc; libc6-compat helps native addons (e.g. Tailwind oxide).
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only what affects the dependency graph so this layer is cached until
# lockfile/manifest change. .npmrc carries legacy-peer-deps for React 19 peers.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---- builder: compile the app ----------------------------------------------
FROM node:${NODE_VERSION} AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Produces .next/standalone (server + traced node_modules) and .next/static.
RUN npm run build

# ---- runner: minimal runtime image -----------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + static assets + public files (chown to the app user).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Basic liveness probe against the app root.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# server.js is emitted by Next's standalone output.
CMD ["node", "server.js"]

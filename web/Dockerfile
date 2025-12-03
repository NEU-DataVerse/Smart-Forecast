# ============================================
# Smart Forecast - Web Frontend Dockerfile
# Multi-stage build for Next.js production
# ============================================

# ===== Stage 1: Dependencies =====
FROM node:22-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json for each workspace package
COPY shared/package.json ./shared/
COPY web/package.json ./web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ===== Stage 2: Builder =====
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy source code
COPY shared ./shared
COPY web ./web

# Build shared package first (dependency)
RUN pnpm --filter @smart-forecast/shared run build

# Build environment variables (will be overridden at runtime)
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js app
RUN pnpm --filter web run build

# ===== Stage 3: Production =====
FROM node:22-alpine AS production

WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built standalone app
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./web/.next/static
COPY --from=builder /app/web/public ./web/public

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["node", "web/server.js"]

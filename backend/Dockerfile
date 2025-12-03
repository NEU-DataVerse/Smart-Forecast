# ============================================
# Smart Forecast - Backend Dockerfile
# Multi-stage build for production
# ============================================

# ===== Stage 1: Builder =====
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json for each workspace package
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY shared ./shared
COPY backend ./backend

# Build shared package first (dependency)
RUN pnpm --filter @smart-forecast/shared run build

# Build backend
RUN pnpm --filter backend run build

# ===== Stage 2: Production =====
FROM node:22-alpine AS production

# Install pnpm for production
RUN corepack enable && corepack prepare pnpm@latest --activate

# Add curl for healthcheck and netcat for db check
RUN apk add --no-cache curl

WORKDIR /app

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Copy assets (fonts, etc.) if needed
COPY --from=builder /app/backend/assets ./backend/assets

# Set environment
ENV NODE_ENV=production
ENV PORT=8000

# Expose port
EXPOSE 8000

# Health check - using Swagger docs endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/api || exit 1

# Start the application
WORKDIR /app/backend
CMD ["node", "dist/main"]
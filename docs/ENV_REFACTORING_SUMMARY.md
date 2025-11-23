# Environment Variables Refactoring Summary

## Overview

Refactored the entire `.env` structure from a single root `.env` file to a **separated, layer-based architecture** for better security, maintainability, and clarity.

## Date

November 20, 2025

## Changes Made

### 1. New Environment File Structure

```
Smart-Forecast/
├── .env                              # ← Docker Compose variable substitution
├── .env.example                      # ← Template for .env
├── docker/
│   ├── .env.infrastructure           # ← DEPRECATED: Use root .env instead
│   └── .env.infrastructure.example
├── backend/
│   ├── .env                          # ← Backend API config
│   └── .env.example
├── web/
│   ├── .env.local                    # ← Web public variables
│   └── .env.local.example
└── mobile/
    ├── .env                          # ← Mobile public variables
    └── .env.example
```

**Important Note:** Docker Compose automatically loads `.env` from root directory for `${VARIABLE}` substitution. The `docker/.env.infrastructure` file is loaded into containers via `env_file` directive, but variables are NOT available for substitution in docker-compose.yml itself.

### 2. Environment Variables Distribution

#### Docker Infrastructure (`docker/.env.infrastructure`)

**Purpose:** Configuration for Docker Compose services only

**Contains:**

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`
- `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`
- `ORION_LOG_LEVEL`
- `COMPOSE_PROJECT_NAME`

**Used by:** `docker-compose.yml`

#### Backend (`backend/.env`)

**Purpose:** Backend NestJS application configuration

**Contains:**

- `DATABASE_URL` - PostgreSQL connection string (recommended)
- `MONGO_URL` - MongoDB connection string
- `OPENWEATHER_API_KEY` - External API key
- `JWT_SECRET` - Authentication secret
- `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` - MinIO client credentials
- `ORION_LD_URL` - Orion Context Broker URL

**Does NOT contain:**

- ❌ Raw database passwords (uses connection strings)
- ❌ Docker infrastructure credentials
- ❌ Public frontend variables

#### Web Frontend (`web/.env.local`)

**Purpose:** Next.js public environment variables

**Contains:**

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_MINIO_URL` - MinIO storage endpoint

**Security:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser

#### Mobile App (`mobile/.env`)

**Purpose:** Expo public environment variables

**Contains:**

- `EXPO_PUBLIC_API_URL` - Backend API endpoint (use IP, not localhost!)
- `EXPO_PUBLIC_MINIO_URL` - MinIO storage endpoint

**Security:** Only variables prefixed with `EXPO_PUBLIC_` are exposed to app

### 3. Code Changes

#### docker-compose.yml

- Added `env_file: - docker/.env.infrastructure` to all services
- MongoDB now uses `MONGO_INITDB_ROOT_USERNAME/PASSWORD`
- Orion uses `${ORION_LOG_LEVEL}` from infrastructure env

#### backend/src/config/database.config.ts

- Added support for `DATABASE_URL` connection string (recommended)
- Kept backward compatibility with individual DB parameters
- Auto-detects connection string vs parameters

#### backend/src/modules/ingestion/providers/openweathermap.provider.ts

- Updated to read `OPENWEATHER_API_KEY` (new name)
- Fallback to `OWM_API_KEY` (old name) for compatibility

#### web/src/services/axios.ts

- Changed from `NEXT_PUBLIC_USER_SERVICE_URL` to `NEXT_PUBLIC_API_URL`
- Added default fallback value

#### .gitignore

- Added specific entries for all environment files:
  - `docker/.env.infrastructure`
  - `backend/.env`
  - `web/.env.local`
  - `mobile/.env`

#### scripts/setup.sh & scripts/setup.bat

- Updated to copy all 4 environment files
- Added reminders about configuring API keys and mobile IP

#### Makefile

- Updated `setup` target to create all 4 environment files
- Added helpful warnings about mobile IP configuration

### 4. Documentation Updates

#### README.md

- Updated environment setup section with new structure
- Added table showing all environment variables by layer
- Added security best practices

#### QUICKSTART.md

- Updated quick start to copy all 4 environment files
- Added reminder about OpenWeatherMap API key

#### docs/DEVELOPMENT_GUIDE.md

- Added comprehensive "Environment Variables" section
- Added security best practices (DO/DON'T)
- Updated project structure diagram

#### scripts/README.md

- Added documentation for `migrate-env.sh` script
- Updated setup script documentation

### 5. New Migration Tools

#### scripts/migrate-env.sh

**Purpose:** Automated migration from old single `.env` to new separated structure

**Features:**

- Parses old root `.env` file
- Creates all 4 new environment files with correct variables
- Backs up old `.env` to `.env.backup`
- Provides clear next steps

## Benefits

### Security

✅ **Backend doesn't store raw credentials** - Uses connection strings instead
✅ **Web/Mobile only expose public variables** - `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*`
✅ **Docker secrets separated** - Infrastructure credentials isolated from application
✅ **No secret sharing** - Each layer has only what it needs

### Maintainability

✅ **Clear separation of concerns** - Each layer has its own environment file
✅ **Easier to debug** - Know exactly where each variable is used
✅ **Better IDE support** - Smaller, focused environment files
✅ **Easier onboarding** - Clear structure for new developers

### Scalability

✅ **Easy to add new services** - Just extend the appropriate environment file
✅ **Multi-environment ready** - Easy to create `.env.production`, `.env.staging`
✅ **Container-friendly** - Docker infrastructure fully separated
✅ **CI/CD friendly** - Easy to inject secrets per layer

## Migration Guide

### For New Projects

```bash
# 1. Copy all environment files
bash scripts/setup.sh

# 2. Edit backend/.env
OPENWEATHER_API_KEY=your_key_here

# 3. Edit mobile/.env
EXPO_PUBLIC_API_URL=http://YOUR_IP:8000/api/v1
```

### For Existing Projects

```bash
# If you have old .env file at root
bash scripts/migrate-env.sh

# This will:
# - Create all 4 new environment files
# - Backup old .env to .env.backup
# - Guide you through next steps
```

## Testing

```bash
# 1. Start Docker services
docker-compose up -d

# 2. Verify services can read environment
docker-compose logs postgres  # Check POSTGRES_USER
docker-compose logs mongodb   # Check MONGO_INITDB_ROOT_USERNAME

# 3. Test backend can connect
pnpm --filter backend run start:dev

# 4. Test web frontend
pnpm --filter web run dev
# Visit http://localhost:3000 and check API calls

# 5. Test mobile app
pnpm --filter mobile run start
# Scan QR code and test API connection
```

## Troubleshooting

### Backend can't connect to database

**Problem:** Connection refused or authentication failed

**Solution:**

1. Check `backend/.env` has correct `DATABASE_URL`
2. Ensure Docker services are running: `docker-compose ps`
3. Verify credentials match between `docker/.env.infrastructure` and connection string

### Web can't reach backend API

**Problem:** Network error or CORS issues

**Solution:**

1. Check `web/.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Verify backend is running: `curl http://localhost:8000/api/v1`
3. Check CORS settings in backend

### Mobile can't connect to backend

**Problem:** Network error, localhost not working

**Solution:**

1. **Don't use localhost!** Use your machine's IP address
2. Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Update `mobile/.env`: `EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1`
4. Ensure phone and computer on same network

## Breaking Changes

⚠️ **If you have existing code:**

1. Old root `.env` file is no longer used
2. `OWM_API_KEY` renamed to `OPENWEATHER_API_KEY` (backward compatible)
3. `NEXT_PUBLIC_USER_SERVICE_URL` → `NEXT_PUBLIC_API_URL`
4. Backend should use `DATABASE_URL` instead of individual params

## Rollback Plan

If you need to rollback:

```bash
# 1. Restore old .env
cp .env.backup .env

# 2. Remove new environment files
rm docker/.env.infrastructure
rm backend/.env
rm web/.env.local
rm mobile/.env

# 3. Restore old docker-compose.yml if needed
git checkout docker-compose.yml
```

## Next Steps

1. ✅ Update CI/CD pipelines to inject environment per layer
2. ✅ Create `.env.production.example` templates
3. ✅ Add environment validation in each service
4. ✅ Document production deployment process
5. ✅ Add health checks for environment variables

## References

- [12-Factor App: Config](https://12factor.net/config)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Docker Compose env_file](https://docs.docker.com/compose/environment-variables/)

---

**Completed by:** Development Team  
**Date:** November 20, 2025  
**Branch:** `refactor/monorepo-pnpm-migration`

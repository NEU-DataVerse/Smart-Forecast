#!/bin/bash

# Migration script: Convert old .env structure to new separated structure
# This script helps migrate from single .env file to separated environment files

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Smart-Forecast Environment Migration      ║${NC}"
echo -e "${BLUE}║   From single .env to separated structure   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Check if old .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found at root. Skipping migration.${NC}"
    echo -e "${GREEN}Creating new environment files from examples...${NC}"
    
    # Copy example files
    [ ! -f docker/.env.infrastructure ] && cp docker/.env.infrastructure.example docker/.env.infrastructure
    [ ! -f backend/.env ] && cp backend/.env.example backend/.env
    [ ! -f web/.env.local ] && cp web/.env.local.example web/.env.local
    [ ! -f mobile/.env ] && cp mobile/.env.example mobile/.env
    
    echo -e "${GREEN}✅ Environment files created!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Edit backend/.env to add your OPENWEATHER_API_KEY"
    echo "  2. Edit mobile/.env to replace YOUR_LOCAL_IP with your machine's IP"
    exit 0
fi

echo -e "${YELLOW}Found old .env file at root.${NC}"
echo ""
echo -e "This script will:"
echo "  1. Parse your existing .env file"
echo "  2. Create new separated environment files"
echo "  3. Backup your old .env to .env.backup"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Migration cancelled.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Starting migration...${NC}"

# Backup old .env
cp .env .env.backup
echo -e "${GREEN}✅ Backed up .env to .env.backup${NC}"

# Function to get value from .env
get_env_value() {
    local key=$1
    local file=${2:-.env}
    grep "^${key}=" "$file" 2>/dev/null | cut -d '=' -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

# Create docker/.env.infrastructure
echo -e "${BLUE}Creating docker/.env.infrastructure...${NC}"
cat > docker/.env.infrastructure << EOF
# ============================================
# Smart Forecast - Docker Infrastructure Environment
# Migrated from root .env
# ============================================

# ====== PostgreSQL Database ======
POSTGRES_USER=$(get_env_value POSTGRES_USER)
POSTGRES_PASSWORD=$(get_env_value POSTGRES_PASSWORD)
POSTGRES_DB=$(get_env_value POSTGRES_DB)

# ====== MongoDB (for Orion-LD) ======
MONGO_INITDB_ROOT_USERNAME=$(get_env_value MONGO_USER)
MONGO_INITDB_ROOT_PASSWORD=$(get_env_value MONGO_PASSWORD)

# ====== MinIO Object Storage ======
MINIO_ROOT_USER=$(get_env_value MINIO_ROOT_USER)
MINIO_ROOT_PASSWORD=$(get_env_value MINIO_ROOT_PASSWORD)

# ====== Orion-LD Context Broker ======
ORION_LOG_LEVEL=DEBUG

# ====== Docker Compose ======
COMPOSE_PROJECT_NAME=smartforecast
EOF
echo -e "${GREEN}✅ Created docker/.env.infrastructure${NC}"

# Create backend/.env
echo -e "${BLUE}Creating backend/.env...${NC}"

POSTGRES_USER=$(get_env_value POSTGRES_USER)
POSTGRES_PASSWORD=$(get_env_value POSTGRES_PASSWORD)
POSTGRES_HOST=$(get_env_value POSTGRES_HOST)
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_DB=$(get_env_value POSTGRES_DB)

MONGO_USER=$(get_env_value MONGO_USER)
MONGO_PASSWORD=$(get_env_value MONGO_PASSWORD)
MONGO_HOST=$(get_env_value MONGO_HOST)
MONGO_HOST=${MONGO_HOST:-localhost}

cat > backend/.env << EOF
# ============================================
# Smart Forecast - Backend Environment
# Migrated from root .env
# ============================================

# ====== Application ======
NODE_ENV=$(get_env_value NODE_ENV)
PORT=$(get_env_value PORT)
API_PREFIX=$(get_env_value API_PREFIX)

# ====== PostgreSQL Database Connection ======
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}

# ====== MongoDB Connection ======
MONGO_URL=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/orion?authSource=admin

# ====== Orion-LD Context Broker ======
ORION_LD_URL=$(get_env_value ORION_LD_URL)
ORION_LD_API_VERSION=$(get_env_value ORION_LD_API_VERSION)
ORION_LD_TENANT=$(get_env_value ORION_LD_TENANT)

# ====== OpenWeatherMap API ======
OPENWEATHER_API_KEY=$(get_env_value OWM_API_KEY)

# ====== JWT Authentication ======
JWT_SECRET=$(get_env_value JWT_SECRET)
JWT_EXPIRATION=$(get_env_value JWT_EXPIRATION)

# ====== MinIO Object Storage ======
MINIO_ENDPOINT=$(get_env_value MINIO_ENDPOINT)
MINIO_PORT=$(get_env_value MINIO_PORT)
MINIO_ACCESS_KEY=$(get_env_value MINIO_ACCESS_KEY)
MINIO_SECRET_KEY=$(get_env_value MINIO_SECRET_KEY)
MINIO_USE_SSL=$(get_env_value MINIO_USE_SSL)
MINIO_BUCKET_NAME=$(get_env_value MINIO_BUCKET_NAME)
EOF
echo -e "${GREEN}✅ Created backend/.env${NC}"

# Create web/.env.local
echo -e "${BLUE}Creating web/.env.local...${NC}"
cat > web/.env.local << EOF
# ============================================
# Smart Forecast - Web Frontend Environment
# Migrated from root .env
# ============================================

# ====== Backend API URL ======
NEXT_PUBLIC_API_URL=$(get_env_value NEXT_PUBLIC_API_URL)

# ====== MinIO Storage URL ======
NEXT_PUBLIC_MINIO_URL=http://localhost:9000

# ====== Optional ======
# NEXT_PUBLIC_MAPBOX_TOKEN=$(get_env_value NEXT_PUBLIC_MAPBOX_TOKEN)
EOF
echo -e "${GREEN}✅ Created web/.env.local${NC}"

# Create mobile/.env
echo -e "${BLUE}Creating mobile/.env...${NC}"
cat > mobile/.env << EOF
# ============================================
# Smart Forecast - Mobile App Environment
# Migrated from root .env
# ============================================

# ====== Backend API URL ======
# IMPORTANT: Replace localhost with your local IP address
EXPO_PUBLIC_API_URL=$(get_env_value EXPO_PUBLIC_API_URL)

# ====== MinIO Storage URL ======
EXPO_PUBLIC_MINIO_URL=http://YOUR_LOCAL_IP:9000

# ====== Optional: Firebase Configuration ======
# EXPO_PUBLIC_FIREBASE_API_KEY=$(get_env_value EXPO_PUBLIC_FIREBASE_API_KEY)
# EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=$(get_env_value EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN)
# EXPO_PUBLIC_FIREBASE_PROJECT_ID=$(get_env_value EXPO_PUBLIC_FIREBASE_PROJECT_ID)
EOF
echo -e "${GREEN}✅ Created mobile/.env${NC}"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Migration Completed! ✅             ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}What happened:${NC}"
echo "  ✅ Created docker/.env.infrastructure"
echo "  ✅ Created backend/.env"
echo "  ✅ Created web/.env.local"
echo "  ✅ Created mobile/.env"
echo "  ✅ Backed up old .env to .env.backup"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review the new environment files"
echo "  2. Update mobile/.env with your local IP address (replace YOUR_LOCAL_IP)"
echo "  3. Test with: docker-compose up -d"
echo "  4. If everything works, you can delete .env and .env.backup"
echo ""
echo -e "${BLUE}For more info, see: docs/DEVELOPMENT_GUIDE.md${NC}"

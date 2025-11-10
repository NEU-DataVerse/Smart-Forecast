#!/bin/bash

# Smart-Forecast Setup Script
# Automatically setup environment for development

set -e

echo "🚀 Smart-Forecast Setup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo "📋 Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed: $(docker --version)${NC}"
echo -e "${GREEN}✅ Docker Compose is installed: $(docker-compose --version)${NC}"
echo ""

# Check if .env file exists
echo "⚙️  Setting up environment variables..."
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists. Do you want to overwrite it? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created from .env.example${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping .env creation${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created from .env.example${NC}"
fi
echo ""

# Prompt user to configure API keys
echo "🔑 API Configuration"
echo "--------------------"
echo -e "${YELLOW}You need to configure the following API keys in .env file:${NC}"
echo "  1. OPENAQ_API_KEY - Get from: https://openaq.org/"
echo "  2. OWM_API_KEY - Get from: https://openweathermap.org/api"
echo "  3. NEXT_PUBLIC_MAPBOX_TOKEN - Get from: https://www.mapbox.com/"
echo ""
echo -e "${YELLOW}Press Enter to continue...${NC}"
read -r

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/logs
mkdir -p web/public/uploads
mkdir -p mobile/assets/temp
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Pull Docker images
echo "🐳 Pulling Docker images..."
docker-compose pull
echo -e "${GREEN}✅ Docker images pulled${NC}"
echo ""

# Start services
echo "🚀 Starting Docker services..."
docker-compose up -d
echo -e "${GREEN}✅ Docker services started${NC}"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

MAX_WAIT=120
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    HEALTHY=$(docker-compose ps | grep -c "healthy" || true)
    TOTAL=$(docker-compose ps | grep -c "Up" || true)
    
    echo "   Health check: $HEALTHY/$TOTAL services healthy"
    
    if [ "$HEALTHY" -eq "$TOTAL" ] && [ "$TOTAL" -gt 0 ]; then
        echo -e "${GREEN}✅ All services are healthy!${NC}"
        break
    fi
    
    sleep 5
    WAITED=$((WAITED + 5))
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo -e "${YELLOW}⚠️  Some services may not be fully healthy yet. Check with 'docker-compose ps'${NC}"
fi
echo ""

# Display service status
echo "📊 Service Status"
echo "=================="
docker-compose ps
echo ""

# Display service URLs
echo "🌐 Service URLs"
echo "==============="
echo -e "${GREEN}✅ Orion Context Broker:${NC} http://localhost:1026"
echo -e "${GREEN}✅ MinIO Console:${NC} http://localhost:9001 (minioadmin/minioadmin)"
echo -e "${GREEN}✅ PostgreSQL:${NC} localhost:5432 (admin/admin)"
echo -e "${GREEN}✅ Cygnus:${NC} http://localhost:5080"
echo ""

# Test Orion endpoint
echo "🧪 Testing Orion Context Broker..."
if curl -s http://localhost:1026/version > /dev/null; then
    echo -e "${GREEN}✅ Orion is responding!${NC}"
else
    echo -e "${YELLOW}⚠️  Orion may not be ready yet. Wait a moment and try: curl http://localhost:1026/version${NC}"
fi
echo ""

# Final instructions
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "  1. Configure API keys in .env file"
echo "  2. Restart services: docker-compose restart"
echo "  3. View logs: docker-compose logs -f"
echo "  4. Stop services: docker-compose down"
echo ""
echo "For development:"
echo "  - Backend: cd backend && npm install && npm run start:dev"
echo "  - Web: cd web && npm install && npm run dev"
echo "  - Mobile: cd mobile && npm install && npx expo start"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"

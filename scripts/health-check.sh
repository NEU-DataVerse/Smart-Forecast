#!/bin/bash

# Smart-Forecast Health Check Script
# Test all services to ensure they are running correctly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Smart-Forecast Health Check${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if Docker Compose is running
echo -e "${YELLOW}Checking Docker Compose status...${NC}"
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}❌ No containers are running. Please run 'docker-compose up -d' first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose is running${NC}"
echo ""

# Function to test HTTP endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    
    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to test with expected response
test_endpoint_with_response() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    response=$(curl -sf "$url" 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ OK${NC}"
        echo -e "${BLUE}   Response: ${response:0:100}...${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Test Services
echo -e "${YELLOW}Testing Service Endpoints...${NC}"
echo "-----------------------------------"

# Test Orion
test_endpoint_with_response "Orion Context Broker" "http://localhost:1026/version"

# Test Backend
test_endpoint "Backend API" "http://localhost:8000/api/v1"

# Test MinIO
test_endpoint "MinIO Health" "http://localhost:9000/minio/health/live"

echo ""

# Test Database Connections
echo -e "${YELLOW}Testing Database Connections...${NC}"
echo "-----------------------------------"

# Test PostgreSQL
echo -n "Testing PostgreSQL... "
if docker-compose exec -T postgres psql -U admin -d smart_forecast_db -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

# Test MongoDB
echo -n "Testing MongoDB... "
if docker-compose exec -T mongodb mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""

# Check Container Health
echo -e "${YELLOW}Checking Container Health Status...${NC}"
echo "-----------------------------------"

containers=("orion" "mongodb" "postgres" "minio")

for container in "${containers[@]}"; do
    echo -n "Checking $container... "
    
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no health check")
    
    if [ "$health" = "healthy" ]; then
        echo -e "${GREEN}✅ healthy${NC}"
    elif [ "$health" = "no health check" ]; then
        # Check if running
        if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            echo -e "${GREEN}✅ running${NC}"
        else
            echo -e "${RED}❌ not running${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  $health${NC}"
    fi
done

echo ""

# Check Ports
echo -e "${YELLOW}Checking Open Ports...${NC}"
echo "-----------------------------------"

ports=(
    "1026:Orion"
    "5432:PostgreSQL"
    "9000:MinIO API"
    "9001:MinIO Console"
    "8000:Backend API"
)

for port_info in "${ports[@]}"; do
    IFS=':' read -r port name <<< "$port_info"
    echo -n "Port $port ($name)... "
    
    if nc -z localhost "$port" 2>/dev/null || timeout 1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null; then
        echo -e "${GREEN}✅ open${NC}"
    else
        echo -e "${RED}❌ closed${NC}"
    fi
done

echo ""

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}================================${NC}"

# Count healthy containers
healthy_count=$(docker-compose ps | grep -c "healthy" || echo "0")
total_count=$(docker-compose ps | grep -c "Up" || echo "0")

echo -e "Containers Running: ${GREEN}$total_count${NC}"
echo -e "Containers Healthy: ${GREEN}$healthy_count${NC}"

if [ "$healthy_count" -eq "$total_count" ] && [ "$total_count" -gt 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All services are running and healthy!${NC}"
    echo ""
    echo -e "${BLUE}Service URLs:${NC}"
    echo "  - Orion: http://localhost:1026"
    echo "  - Backend: http://localhost:8000"
    echo "  - MinIO Console: http://localhost:9001"
    echo "  - PostgreSQL: localhost:5432"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some services may need attention.${NC}"
    echo -e "${YELLOW}Run 'docker-compose logs' to check for errors.${NC}"
    exit 1
fi

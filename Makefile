.PHONY: help setup up down restart logs ps clean backup test dev

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Hiển thị help
	@echo "$(BLUE)Smart-Forecast - Makefile Commands$(NC)"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

setup: ## Thiết lập môi trường lần đầu
	@echo "$(BLUE)🚀 Setting up Smart-Forecast...$(NC)"
	@if [ ! -f docker/.env.infrastructure ]; then \
		cp docker/.env.infrastructure.example docker/.env.infrastructure; \
		echo "$(GREEN)✅ Created docker/.env.infrastructure$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  docker/.env.infrastructure already exists$(NC)"; \
	fi
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "$(GREEN)✅ Created backend/.env$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  backend/.env already exists$(NC)"; \
	fi
	@if [ ! -f web/.env.local ]; then \
		cp web/.env.local.example web/.env.local; \
		echo "$(GREEN)✅ Created web/.env.local$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  web/.env.local already exists$(NC)"; \
	fi
	@if [ ! -f mobile/.env ]; then \
		cp mobile/.env.example mobile/.env; \
		echo "$(GREEN)✅ Created mobile/.env$(NC)"; \
		echo "$(YELLOW)⚠️  Remember to update EXPO_PUBLIC_API_URL in mobile/.env$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  mobile/.env already exists$(NC)"; \
	fi
	@mkdir -p backend/logs web/public/uploads mobile/assets/temp
	@echo "$(GREEN)✅ Setup complete!$(NC)"

up: ## Khởi động tất cả services
	@echo "$(BLUE)🚀 Starting services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Services started!$(NC)"

down: ## Dừng tất cả services
	@echo "$(BLUE)🛑 Stopping services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Services stopped!$(NC)"

restart: ## Restart tất cả services
	@echo "$(BLUE)🔄 Restarting services...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✅ Services restarted!$(NC)"

logs: ## Xem logs tất cả services
	@docker-compose logs -f

ps: ## Xem status các services
	@docker-compose ps

clean: ## Dừng và xóa tất cả (bao gồm volumes)
	@echo "$(RED)⚠️  This will delete all data!$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to cancel, or wait 5 seconds to continue...$(NC)"
	@sleep 5
	@docker-compose down -v
	@echo "$(GREEN)✅ Cleanup complete!$(NC)"

pull: ## Pull latest images
	@echo "$(BLUE)📥 Pulling latest images...$(NC)"
	@docker-compose pull
	@echo "$(GREEN)✅ Images pulled!$(NC)"

build: ## Build services
	@echo "$(BLUE)🔨 Building services...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✅ Build complete!$(NC)"

rebuild: ## Rebuild và restart services
	@echo "$(BLUE)🔨 Rebuilding services...$(NC)"
	@docker-compose up -d --build
	@echo "$(GREEN)✅ Rebuild complete!$(NC)"

backup: ## Backup databases
	@echo "$(BLUE)💾 Backing up databases...$(NC)"
	@mkdir -p backups
	@docker exec postgres pg_dump -U admin smart_forecast_db > backups/postgres-backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)✅ PostgreSQL backup created!$(NC)"
	@docker exec mongodb mongodump --out /tmp/backup
	@docker cp mongodb:/tmp/backup backups/mongodb-backup-$$(date +%Y%m%d-%H%M%S)
	@echo "$(GREEN)✅ MongoDB backup created!$(NC)"

test: ## Test các services
	@echo "$(BLUE)🧪 Testing services...$(NC)"
	@echo "Testing Orion Context Broker..."
	@curl -s http://localhost:1026/version > /dev/null && echo "$(GREEN)✅ Orion OK$(NC)" || echo "$(RED)❌ Orion Failed$(NC)"
	@echo "Testing Backend API..."
	@curl -s http://localhost:8000/api/v1 > /dev/null && echo "$(GREEN)✅ Backend OK$(NC)" || echo "$(RED)❌ Backend Failed$(NC)"
	@echo "Testing MinIO..."
	@curl -s http://localhost:9000/minio/health/live > /dev/null && echo "$(GREEN)✅ MinIO OK$(NC)" || echo "$(RED)❌ MinIO Failed$(NC)"

dev-backend: ## Chạy backend development
	@echo "$(BLUE)🚀 Starting backend development...$(NC)"
	@pnpm --filter backend run start:dev

dev-web: ## Chạy web frontend development
	@echo "$(BLUE)🚀 Starting web development...$(NC)"
	@pnpm --filter web run dev

dev-mobile: ## Chạy mobile app development
	@echo "$(BLUE)🚀 Starting mobile development...$(NC)"
	@pnpm --filter mobile run start

install: ## Install dependencies cho tất cả packages
	@echo "$(BLUE)📦 Installing dependencies...$(NC)"
	@pnpm install
	@echo "$(GREEN)✅ All dependencies installed!$(NC)"

db-shell: ## Mở PostgreSQL shell
	@docker exec -it postgres psql -U admin -d smart_forecast_db

mongo-shell: ## Mở MongoDB shell
	@docker exec -it mongodb mongo

minio-console: ## Mở MinIO console trong browser
	@echo "$(BLUE)Opening MinIO Console...$(NC)"
	@echo "URL: http://localhost:9001"
	@echo "Username: minioadmin"
	@echo "Password: minioadmin"
	@open http://localhost:9001 2>/dev/null || xdg-open http://localhost:9001 2>/dev/null || start http://localhost:9001 2>/dev/null || echo "$(YELLOW)Please open http://localhost:9001 manually$(NC)"

health: ## Kiểm tra health của services
	@echo "$(BLUE)🏥 Checking service health...$(NC)"
	@docker-compose ps

stats: ## Xem resource usage
	@docker stats --no-stream

networks: ## Xem docker networks
	@docker network ls | grep smart-forecast

volumes: ## Xem docker volumes
	@docker volume ls | grep smart-forecast

logs-orion: ## Xem logs Orion
	@docker-compose logs -f orion

logs-postgres: ## Xem logs PostgreSQL
	@docker-compose logs -f postgres

logs-minio: ## Xem logs MinIO
	@docker-compose logs -f minio

logs-backend: ## Xem logs Backend
	@docker-compose logs -f backend

reset: down clean setup up ## Reset toàn bộ hệ thống
	@echo "$(GREEN)✅ System reset complete!$(NC)"

version: ## Hiển thị version các services
	@echo "$(BLUE)📋 Service Versions$(NC)"
	@echo "===================="
	@docker-compose exec orion curl -s http://localhost:1026/version | grep version || echo "Orion: Not running"
	@docker-compose exec postgres psql -U admin -d smart_forecast_db -c "SELECT version();" || echo "PostgreSQL: Not running"
	@echo ""

.DEFAULT_GOAL := help

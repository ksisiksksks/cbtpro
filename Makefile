.PHONY: dev build start db-push db-seed docker-up docker-down

# Development Scripts
dev:
	@echo "Starting development servers..."
	@start cmd /c "cd backend && npm run dev"
	@start cmd /c "cd frontend && npm run dev"

# Production Builds
build:
	@echo "Building frontend..."
	@cd frontend && npm run build
	@echo "Building backend..."
	@cd backend && npm run build

# Database Scripts
db-push:
	@cd backend && npx prisma db push

db-seed:
	@cd backend && npx ts-node seed.ts

# Docker Compose Controls
docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

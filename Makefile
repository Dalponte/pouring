# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	docker-compose build --no-cache

docker-recreate:
	docker-compose up --build --force-recreate --remove-orphans

# Project start
dev-backend:
	cd apps/backend && npm run start:dev

dev-frontend:
	cd apps/frontend && npm run dev

# Database commands
db-migrate:
	cd apps/backend && npm run migrate:dev

db-generate:
	cd apps/backend && npm run migrate:generate

db-reset:
	cd apps/backend && npm run db:reset

# Install dependencies
install:
	cd apps/backend && npm install
	cd apps/frontend && npm install

help:
	@echo "Available commands:"
	@echo "  docker-up       - Start all containers"
	@echo "  docker-down     - Stop all containers"
	@echo "  docker-logs     - View container logs"
	@echo "  docker-build    - Rebuild containers"
	@echo "  dev-backend     - Run backend in development mode"
	@echo "  dev-frontend    - Run frontend in development mode"
	@echo "  db-migrate      - Run database migrations"
	@echo "  db-generate     - Generate database migrations"
	@echo "  db-reset        - Reset database"
	@echo "  install         - Install dependencies"

.PHONY: docker-up docker-down docker-logs docker-build dev-backend dev-frontend db-migrate db-generate db-reset install help

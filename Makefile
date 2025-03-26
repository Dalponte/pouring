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

# Add a specific target to just prepare MQTT
setup-mqtt:
	mkdir -p mqtt/config mqtt/data mqtt/log
	chmod -R 777 mqtt

# Project start
dev-backend:
	cd apps/backend && npm run dev

dev-taps:
	cd apps/taps && npm run dev

# Database commands
db-migrate:
	cd apps/backend && npm run migrate:dev

db-generate:
	cd apps/backend && npm run migrate:generate

db-reset:
	cd apps/backend && npm run db:reset

db-reset-and-migrate:
	cd apps/backend && npm run db:reset && npm run migrate:dev

# Install dependencies
install:
	cd apps/backend && pnpm install
	cd apps/taps && pnpm install

# Git Flow commands
gf-init:
	git flow init -d

gf-feat:
	@if [ -z "$(name)" ]; then echo "Usage: make git-flow-feature-start name=<feature-name>"; exit 1; fi
	git flow feature start $(name)

gf-feat-finish:
	@if [ -z "$(name)" ]; then echo "Usage: make git-flow-feature-finish name=<feature-name>"; exit 1; fi
	git flow feature finish $(name)

gf-release:
	@if [ -z "$(version)" ]; then echo "Usage: make git-flow-release-start version=<release-version>"; exit 1; fi
	git flow release start $(version)

gf-release-finish:
	@if [ -z "$(version)" ]; then echo "Usage: make git-flow-release-finish version=<release-version>"; exit 1; fi
	git flow release finish $(version)

gf-hotfix:
	@if [ -z "$(version)" ]; then echo "Usage: make git-flow-hotfix-start version=<hotfix-version>"; exit 1; fi
	git flow hotfix start $(version)

gf-hotfix-finish:
	@if [ -z "$(version)" ]; then echo "Usage: make git-flow-hotfix-finish version=<hotfix-version>"; exit 1; fi
	git flow hotfix finish $(version)

help:
	@echo "Available commands:"
	@echo "  docker-up       - Start all containers"
	@echo "  docker-down     - Stop all containers"
	@echo "  docker-logs     - View container logs"
	@echo "  docker-build    - Rebuild containers"
	@echo "  dev-backend     - Run backend in development mode"
	@echo "  dev-taps    	 - Run Taps simulator in development mode"
	@echo "  db-migrate      - Run database migrations"
	@echo "  db-generate     - Generate database migrations"
	@echo "  db-reset        - Reset database"
	@echo "  install         - Install dependencies"

.PHONY: docker-up docker-down docker-logs docker-build dev-backend dev-taps db-migrate db-generate db-reset db-reset-and-migrate install git-flow-init git-flow-feature-start git-flow-feature-finish git-flow-release-start git-flow-release-finish git-flow-hotfix-start git-flow-hotfix-finish help

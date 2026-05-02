.PHONY: help up down build shell migrate fresh artisan logs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start all containers
	docker-compose up -d

down: ## Stop all containers
	docker-compose down

build: ## Rebuild containers
	docker-compose build --no-cache

shell: ## Bash into app container
	docker-compose exec -u exampulse app bash

migrate: ## Run migrations
	docker-compose exec -u exampulse app php artisan migrate

fresh: ## Fresh migration with seed
	docker-compose exec -u exampulse app php artisan migrate:fresh --seed

artisan: ## Run artisan command (use: make artisan cmd="make:controller FooController")
	docker-compose exec -u exampulse app php artisan $(cmd)

logs: ## Tail logs
	docker-compose logs -f

# Использование: make <цель>   |   make help — список команд
# Если нет make:  sudo pacman -S make

# UID/GID текущего пользователя: бэкенд пишет в ./data от его имени
export APP_UID := $(shell id -u)
export APP_GID := $(shell id -g)

COMPOSE := docker compose -f docker/docker-compose.yaml
DEV     := $(COMPOSE) -f docker/docker-compose.dev.yaml
s       ?=# сервис для logs/restart/sh: make logs s=backend

.DEFAULT_GOAL := help
.PHONY: help up down restart build rebuild ps logs sh psql \
	    dev-up dev-down dev db back front front-install front-build typecheck test clean nuke

help: ## показать команды
	@awk 'BEGIN{FS=":.*## "} /^[a-zA-Z_-]+:.*## /{printf "  \033[31m%-14s\033[0m %s\n",$$1,$$2}' $(MAKEFILE_LIST)

# ---------- весь стек в Docker (postgres + backend + frontend/nginx) ----------
up: ## поднять всё (http://localhost)
	$(COMPOSE) up -d --build

down: ## остановить всё
	$(COMPOSE) down

restart: ## перезапустить (s=сервис)
	$(COMPOSE) restart $(s)

build: ## пересобрать образы (s=сервис)
	$(COMPOSE) build $(s)

rebuild: ## пересобрать без кэша и поднять
	$(COMPOSE) build --no-cache && $(COMPOSE) up -d

ps: ## статус контейнеров
	$(COMPOSE) ps

logs: ## логи в реальном времени (s=сервис)
	$(COMPOSE) logs -f --tail=100 $(s)

sh: ## shell в контейнере (s=backend|frontend|postgres)
	$(COMPOSE) exec $(or $(s),backend) sh

psql: ## консоль PostgreSQL
	docker exec -it postgres psql -U postgres

# ---------- разработка: БД+бэк в Docker, фронт локально ----------
dev: dev-up front ## БД и бэк в Docker + vite dev-сервер (http://localhost:5173)

dev-up: ## dev-стек без фронта (открыты порты бэка и отладки)
	$(DEV) up -d --build postgres backend

dev-down: ## остановить dev-стек
	$(DEV) down

# ---------- по отдельности, каждая в своём терминале ----------
db: ## только PostgreSQL в Docker (порт 15432)
	$(COMPOSE) up -d postgres

back: ## бэкенд локально через Gradle
	./gradlew bootRun

test: ## тесты бэкенда
	./gradlew test

front-install: ## npm install
	cd frontend && npm install

front: ## vite dev-сервер
	cd frontend && npm run dev

front-build: ## собрать фронт в src/main/resources/static (без Docker)
	cd frontend && npm run build

typecheck: ## проверка типов фронта
	cd frontend && npm run typecheck

# ---------- уборка ----------
clean: ## удалить build/ и frontend/dist
	./gradlew clean
	rm -rf frontend/dist

nuke: ## ОСТОРОЖНО: остановить всё и удалить тома БД
	$(COMPOSE) down -v --remove-orphans

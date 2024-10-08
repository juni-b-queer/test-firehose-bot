.PHONY: *

run:
	bun run run

run-jetstream:
	docker compose up -d jetstream

build:
	docker compose build

up:
	docker compose up -d

up-logs:
	docker compose up

down:
	docker compose down

logs:
	docker compose logs -f

install:
	bun install

link:
	bun link bsky-event-handlers


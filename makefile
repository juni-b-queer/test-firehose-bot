.PHONY: *

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


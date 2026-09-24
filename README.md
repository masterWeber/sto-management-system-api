# STO Management System API

NestJS + PostgreSQL, всё запускается в Docker.

## Запуск

```bash
cp .env.example .env
docker compose up --build
```

API будет доступен на `http://localhost:3000` (порт задаётся через `PORT` в `.env`).

## Остановка

```bash
docker compose down
```

Данные Postgres хранятся в volume `postgres_data` и переживают остановку контейнеров.

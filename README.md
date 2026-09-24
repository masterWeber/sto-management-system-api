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

## Архитектура

Backend построен по DDD/гексагональной архитектуре: каждый домен — модуль Nest со слоями `domain/` (бизнес-логика, не зависит от NestJS/TypeORM), `application/` (use-case'ы), `infrastructure/` (TypeORM, внешние сервисы), `interface/` (контроллеры, DTO).

Домены:
- **Auth** — вход по логину/паролю, выдача JWT
- **Staff** — учётные записи сотрудников (Администратор / Менеджер / Мастер)
- **Clients** — клиенты СТО: CRUD, поиск по ФИО/телефону
- **Cars** — автомобили клиентов: CRUD, поиск по госномеру и клиенту
- **PriceList** — категории услуг и прайс-лист: CRUD, поиск по названию и категории
- **Warehouse** — категории товаров и склад: CRUD, поиск по названию/артикулу, фильтр по наличию

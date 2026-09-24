import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('STO Management System API')
    .setDescription('API веб-системы управления СТО')
    .setVersion('0.1')
    .addBearerAuth()
    .addTag('health', 'Проверка работоспособности сервиса и подключения к БД')
    .addTag('auth', 'Вход по логину/паролю, выдача JWT-токена')
    .addTag('staff', 'Учётные записи сотрудников (Администратор/Менеджер/Мастер)')
    .addTag('clients', 'Клиенты СТО: CRUD, поиск по ФИО и телефону')
    .addTag('cars', 'Автомобили клиентов: CRUD, поиск по госномеру и клиенту')
    .addTag('service-categories', 'Категории услуг прайс-листа: CRUD')
    .addTag('services', 'Прайс-лист услуг: CRUD, поиск по названию и категории')
    .addTag('product-categories', 'Категории товаров склада: CRUD')
    .addTag('products', 'Склад: CRUD товаров, поиск по названию/артикулу, фильтр по наличию')
    .addTag('orders', 'Заказ-наряды: создание, статус-машина, позиции работ, фильтры')
    .addTag('expenses', 'Расходы: CRUD, фильтр по периоду и категории')
    .addTag('finance', 'Финансовая сводка и отчёты: выручка, расходы, прибыль, график по периодам')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

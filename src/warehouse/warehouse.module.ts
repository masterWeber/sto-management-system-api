import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PRODUCT_CATEGORY_REPOSITORY } from './domain/product-category-repository.port.js';
import { PRODUCT_REPOSITORY } from './domain/product-repository.port.js';
import { ProductCategoryOrmEntity } from './infrastructure/persistence/product-category.orm-entity.js';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity.js';
import { TypeOrmProductCategoryRepository } from './infrastructure/typeorm-product-category.repository.js';
import { TypeOrmProductRepository } from './infrastructure/typeorm-product.repository.js';
import { CreateProductCategoryUseCase } from './application/use-cases/create-product-category.use-case.js';
import { UpdateProductCategoryUseCase } from './application/use-cases/update-product-category.use-case.js';
import { DeleteProductCategoryUseCase } from './application/use-cases/delete-product-category.use-case.js';
import { GetProductCategoryUseCase } from './application/use-cases/get-product-category.use-case.js';
import { ListProductCategoriesUseCase } from './application/use-cases/list-product-categories.use-case.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from './application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case.js';
import { ProductCategoriesController } from './interface/product-categories.controller.js';
import { ProductsController } from './interface/products.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryOrmEntity, ProductOrmEntity])],
  controllers: [ProductCategoriesController, ProductsController],
  providers: [
    { provide: PRODUCT_CATEGORY_REPOSITORY, useClass: TypeOrmProductCategoryRepository },
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    CreateProductCategoryUseCase,
    UpdateProductCategoryUseCase,
    DeleteProductCategoryUseCase,
    GetProductCategoryUseCase,
    ListProductCategoriesUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
  ],
})
export class WarehouseModule {}

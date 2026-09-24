import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategoryOrmEntity } from './product-category.orm-entity.js';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  publicId!: string;

  @Column()
  name!: string;

  @Index()
  @Column({ unique: true })
  sku!: string;

  @Column({ type: 'integer', default: 0 })
  quantity!: number;

  @ManyToOne(() => ProductCategoryOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: ProductCategoryOrmEntity;

  @Index()
  @Column()
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

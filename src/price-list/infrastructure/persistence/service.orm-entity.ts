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
import { ServiceCategoryOrmEntity } from './service-category.orm-entity.js';

@Entity('services')
export class ServiceOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  publicId!: string;

  @Column()
  name!: string;

  @Column({ type: 'integer' })
  priceKopecks!: number;

  @ManyToOne(() => ServiceCategoryOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: ServiceCategoryOrmEntity;

  @Index()
  @Column()
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

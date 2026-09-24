import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceOrmEntity } from '../../../price-list/infrastructure/persistence/service.orm-entity.js';
import { OrderOrmEntity } from './order.orm-entity.js';

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  publicId!: string;

  @ManyToOne(() => OrderOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: OrderOrmEntity;

  @Column()
  orderId!: number;

  @ManyToOne(() => ServiceOrmEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'serviceId' })
  service?: ServiceOrmEntity;

  @Column({ nullable: true })
  serviceId?: number;

  @Column()
  name!: string;

  @Column({ type: 'integer' })
  priceKopecks!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

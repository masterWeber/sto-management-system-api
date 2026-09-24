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
import { CarOrmEntity } from '../../../cars/infrastructure/persistence/car.orm-entity.js';
import { ClientOrmEntity } from '../../../clients/infrastructure/persistence/client.orm-entity.js';
import { StaffUserOrmEntity } from '../../../staff/infrastructure/persistence/staff-user.orm-entity.js';
import { ORDER_STATUSES, type OrderStatus } from '../../domain/order-status.js';

@Entity('orders')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  publicId!: string;

  @ManyToOne(() => ClientOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'clientId' })
  client!: ClientOrmEntity;

  @Index()
  @Column()
  clientId!: number;

  @ManyToOne(() => CarOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'carId' })
  car!: CarOrmEntity;

  @Index()
  @Column()
  carId!: number;

  @Column({ type: 'timestamptz' })
  scheduledAt!: Date;

  @Index()
  @Column({ type: 'enum', enum: ORDER_STATUSES, default: 'RECEIVED' })
  status!: OrderStatus;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ManyToOne(() => StaffUserOrmEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedMasterId' })
  assignedMaster?: StaffUserOrmEntity;

  @Index()
  @Column({ nullable: true })
  assignedMasterId?: number;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

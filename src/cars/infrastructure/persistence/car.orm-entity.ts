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
import { ClientOrmEntity } from '../../../clients/infrastructure/persistence/client.orm-entity.js';

@Entity('cars')
export class CarOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'uuid', unique: true })
  publicId!: string;

  @Column()
  make!: string;

  @Column({ type: 'smallint' })
  year!: number;

  @Index()
  @Column()
  licensePlate!: string;

  @Column({ nullable: true })
  vin?: string;

  @ManyToOne(() => ClientOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'clientId' })
  client!: ClientOrmEntity;

  @Index()
  @Column()
  clientId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AlertLevel, AlertType } from '@smart-forecast/shared';
import { User } from '../../user/entities/user.entity';

@Entity('alerts')
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AlertLevel,
  })
  level: AlertLevel;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  type: AlertType;

  @Column('text')
  title: string;

  @Column('text')
  message: string;

  @Column('jsonb', { nullable: true })
  area: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON Polygon format
  } | null;

  @Column('timestamp')
  sentAt: Date;

  @Column('timestamp', { nullable: true })
  expiresAt: Date | null;

  @Column('int', { default: 0 })
  sentCount: number;

  @Column('uuid')
  createdBy: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

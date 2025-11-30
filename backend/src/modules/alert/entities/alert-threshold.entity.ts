import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AlertLevel,
  AlertType,
  AlertMetric,
  ThresholdOperator,
} from '@smart-forecast/shared';

@Entity('alert_thresholds')
export class AlertThresholdEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  type: AlertType;

  @Column({
    type: 'enum',
    enum: AlertMetric,
  })
  metric: AlertMetric;

  @Column({
    type: 'enum',
    enum: ThresholdOperator,
  })
  operator: ThresholdOperator;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: AlertLevel,
  })
  level: AlertLevel;

  @Column('text')
  adviceTemplate: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

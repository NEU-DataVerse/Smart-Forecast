import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IncidentType, IncidentStatus } from '@smart-forecast/shared';
import { User } from '../../user/entities/user.entity';

@Entity('incidents')
export class IncidentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: IncidentType,
  })
  type: IncidentType;

  @Column('text')
  description: string;

  @Column('jsonb')
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  @Column('simple-array')
  imageUrls: string[];

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.PENDING,
  })
  status: IncidentStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'reportedBy' })
  reportedBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verifiedBy' })
  verifiedBy: User | null;

  @Column('text', { nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

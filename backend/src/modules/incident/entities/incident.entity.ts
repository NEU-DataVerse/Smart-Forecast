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

  @Column('uuid', { nullable: false })
  reportedBy: string;

  @ManyToOne(() => User, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'reportedBy' })
  reporter: User;

  @Column('uuid', { nullable: true })
  verifiedBy: string | null;

  @ManyToOne(() => User, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'verifiedBy' })
  verifier: User | null;

  @Column('text', { nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

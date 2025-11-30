import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@smart-forecast/shared';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER as UserRole,
  })
  role: UserRole;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Exclude()
  @Column({ nullable: true })
  fcmToken: string;

  @Column('timestamp', { nullable: true })
  fcmTokenUpdatedAt: Date | null;

  /**
   * User's current location stored as GeoJSON Point
   * Format: { type: 'Point', coordinates: [longitude, latitude] }
   */
  @Index({ spatial: true })
  @Column('geography', {
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  } | null;

  @Column('timestamp', { nullable: true })
  locationUpdatedAt: Date | null;

  @Exclude()
  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ default: 'local' })
  provider: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password && this.provider === 'local') {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { UserRole } from '@smart-forecast/shared';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const count = await this.userRepository.count();

    if (count > 0) {
      this.logger.log('Users already exist, skipping seeding');
      return;
    }

    this.logger.log('Seeding users...');

    // Create Admin user
    const admin = this.userRepository.create({
      email: 'admin@smartforecast.com',
      password: 'admin123',
      fullName: 'System Administrator',
      role: UserRole.ADMIN,
      provider: 'local',
      emailVerified: true,
      isActive: true,
    });

    // Create sample User (Google OAuth simulation)
    const testUser = this.userRepository.create({
      email: 'user@test.com',
      fullName: 'Test User',
      role: UserRole.USER,
      provider: 'google',
      googleId: 'test-google-id-12345',
      emailVerified: true,
      isActive: true,
    });

    await this.userRepository.save([admin, testUser]);

    this.logger.log('✅ Seeded 2 users successfully:');
    this.logger.log('   Admin: admin@smartforecast.com / admin123');
    this.logger.log('   User: user@test.com (Google OAuth)');
  }
}

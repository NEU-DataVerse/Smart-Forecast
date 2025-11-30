import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { FcmService } from './services/fcm.service';

@Injectable()
export class FcmCleanupScheduler {
  private readonly logger = new Logger(FcmCleanupScheduler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * Clean up invalid FCM tokens daily at 3 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupInvalidTokens(): Promise<void> {
    this.logger.log('Starting FCM token cleanup...');

    try {
      // Get all users with FCM tokens
      const usersWithTokens = await this.userRepository.find({
        where: {
          fcmToken: Not(IsNull()),
          isActive: true,
        },
        select: ['id', 'fcmToken'],
      });

      if (usersWithTokens.length === 0) {
        this.logger.debug('No FCM tokens to validate');
        return;
      }

      this.logger.log(`Validating ${usersWithTokens.length} FCM tokens...`);

      const invalidUserIds: string[] = [];
      const batchSize = 100;

      // Process tokens in batches
      for (let i = 0; i < usersWithTokens.length; i += batchSize) {
        const batch = usersWithTokens.slice(i, i + batchSize);
        const tokens = batch.map((u) => u.fcmToken).filter(Boolean);

        if (tokens.length === 0) continue;

        // Use dry-run to validate tokens
        const result = await this.fcmService.sendBulkNotification(
          tokens,
          {
            title: 'Token Validation',
            body: 'This is a validation message',
          },
          true, // dryRun
        );

        // Map failed tokens back to user IDs
        for (const failedToken of result.failedTokens) {
          const user = batch.find((u) => u.fcmToken === failedToken);
          if (user) {
            invalidUserIds.push(user.id);
          }
        }
      }

      // Clear invalid tokens
      if (invalidUserIds.length > 0) {
        await this.userService.clearInvalidFcmTokens(invalidUserIds);
        this.logger.log(
          `Cleaned up ${invalidUserIds.length} invalid FCM tokens`,
        );
      } else {
        this.logger.log('All FCM tokens are valid');
      }
    } catch (error) {
      this.logger.error('Error during FCM token cleanup:', error);
    }
  }

  /**
   * Manual trigger for token cleanup
   */
  async triggerCleanup(): Promise<{ message: string; cleanedCount: number }> {
    this.logger.log('Manual FCM cleanup triggered');

    const initialCount = await this.userRepository.count({
      where: { fcmToken: Not(IsNull()) },
    });

    await this.cleanupInvalidTokens();

    const finalCount = await this.userRepository.count({
      where: { fcmToken: Not(IsNull()) },
    });

    const cleanedCount = initialCount - finalCount;

    return {
      message: 'FCM token cleanup completed',
      cleanedCount,
    };
  }
}

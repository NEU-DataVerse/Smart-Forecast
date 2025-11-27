import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertEntity } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertQueryDto } from './dto/alert-query.dto';
import { FcmService } from './services/fcm.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * Create and send alert to all users with FCM tokens
   */
  async createAndSend(
    createDto: CreateAlertDto,
    adminId: string,
  ): Promise<AlertEntity> {
    // Create alert entity
    const alert = this.alertRepository.create({
      ...createDto,
      createdBy: adminId,
      sentAt: new Date(),
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
    });

    // Get all active users with FCM tokens
    const users = await this.userRepository.find({
      where: { isActive: true },
      select: ['fcmToken'],
    });

    const fcmTokens = users
      .map((user) => user.fcmToken)
      .filter((token) => token && token.length > 0);

    this.logger.log(`Found ${fcmTokens.length} FCM tokens to send alert`);

    // Send FCM notifications
    if (fcmTokens.length > 0) {
      const result = await this.fcmService.sendBulkNotification(fcmTokens, {
        title: createDto.title,
        body: createDto.message,
        data: {
          alertId: alert.id || '',
          level: createDto.level,
          type: createDto.type,
        },
      });

      alert.sentCount = result.successCount;

      // TODO: Remove failed tokens from database (implement cleanup later)
      if (result.failedTokens.length > 0) {
        this.logger.warn(
          `${result.failedTokens.length} tokens failed, should be cleaned up`,
        );
      }
    } else {
      alert.sentCount = 0;
      this.logger.warn('No FCM tokens available to send alert');
    }

    // Save alert to database
    return this.alertRepository.save(alert);
  }

  /**
   * Find all alerts with filters and pagination
   */
  async findAll(query: AlertQueryDto): Promise<{
    data: AlertEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, level, type, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.creator', 'creator');

    // Apply filters
    if (level) {
      queryBuilder.andWhere('alert.level = :level', { level });
    }

    if (type) {
      queryBuilder.andWhere('alert.type = :type', { type });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('alert.sentAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    // Apply pagination and sorting
    queryBuilder.skip(skip).take(limit).orderBy('alert.sentAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get active alerts (not expired)
   */
  async getActiveAlerts(): Promise<AlertEntity[]> {
    const now = new Date();

    return this.alertRepository
      .createQueryBuilder('alert')
      .where('alert.expiresAt IS NULL OR alert.expiresAt > :now', { now })
      .orderBy('alert.sentAt', 'DESC')
      .limit(10)
      .getMany();
  }
}

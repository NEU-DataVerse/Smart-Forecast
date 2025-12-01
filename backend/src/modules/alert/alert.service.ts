import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AlertEntity } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertQueryDto } from './dto/alert-query.dto';
import { FcmService } from './services/fcm.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AlertLevel, AlertType } from '@smart-forecast/shared';

interface CreateAutoAlertParams {
  type: AlertType;
  level: AlertLevel;
  title: string;
  message: string;
  advice: string;
  stationId: string;
  sourceData: Record<string, unknown>;
  area?: { type: 'Polygon'; coordinates: number[][][] } | null;
}

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly bufferKm: number;

  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fcmService: FcmService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.bufferKm = this.configService.get<number>('ALERT_BUFFER_KM', 5);
  }

  /**
   * Create and send manual alert to users (Admin action)
   */
  async createAndSend(
    createDto: CreateAlertDto,
    adminId: string,
  ): Promise<AlertEntity> {
    // Create alert entity
    const alert = this.alertRepository.create({
      ...createDto,
      createdBy: adminId,
      incidentId: createDto.incidentId || null,
      isAutomatic: false,
      sentAt: new Date(),
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
    });

    // Get users to notify (filtered by area if provided)
    let fcmTokens: string[] = [];

    if (createDto.area) {
      // Send to users within the affected area
      const usersInArea = await this.userService.findUsersInAreaWithBuffer(
        createDto.area,
        this.bufferKm,
      );
      fcmTokens = usersInArea
        .map((user) => user.fcmToken)
        .filter((token) => token && token.length > 0);

      this.logger.log(
        `Found ${fcmTokens.length} users in affected area (+${this.bufferKm}km buffer)`,
      );
    } else {
      // Broadcast to all active users
      const users = await this.userRepository.find({
        where: { isActive: true },
        select: ['id', 'fcmToken'],
      });
      fcmTokens = users
        .map((user) => user.fcmToken)
        .filter((token) => token && token.length > 0);

      this.logger.log(`Broadcasting to ${fcmTokens.length} users`);
    }

    // Send FCM notifications
    if (fcmTokens.length > 0) {
      const result = await this.fcmService.sendBulkNotification(fcmTokens, {
        title: createDto.title,
        body: createDto.message,
        data: {
          alertId: alert.id || '',
          level: createDto.level,
          type: createDto.type,
          advice: createDto.advice || '',
        },
      });

      alert.sentCount = result.successCount;

      // Cleanup failed tokens
      if (result.failedTokens.length > 0) {
        this.logger.warn(
          `${result.failedTokens.length} tokens failed, cleaning up...`,
        );
        await this.cleanupFailedTokens(result.failedTokens);
      }
    } else {
      alert.sentCount = 0;
      this.logger.warn('No FCM tokens available to send alert');
    }

    // Save alert to database
    return this.alertRepository.save(alert);
  }

  /**
   * Create automatic alert (from scheduler)
   */
  async createAutoAlert(params: CreateAutoAlertParams): Promise<AlertEntity> {
    const { type, level, title, message, advice, stationId, sourceData, area } =
      params;

    // Create alert entity
    const alert = this.alertRepository.create({
      type,
      level,
      title,
      message,
      advice,
      stationId,
      sourceData,
      area,
      isAutomatic: true,
      createdBy: null, // Auto-generated
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // Expires in 4 hours
    });

    // Get users to notify
    let fcmTokens: string[] = [];

    if (area) {
      const usersInArea = await this.userService.findUsersInAreaWithBuffer(
        area,
        this.bufferKm,
      );
      fcmTokens = usersInArea
        .map((user) => user.fcmToken)
        .filter((token) => token && token.length > 0);

      this.logger.log(
        `Auto alert: Found ${fcmTokens.length} users in affected area`,
      );
    } else {
      const users = await this.userService.findUsersWithFcmTokens();
      fcmTokens = users
        .map((user) => user.fcmToken)
        .filter((token) => token && token.length > 0);
    }

    // Send notifications
    if (fcmTokens.length > 0) {
      const result = await this.fcmService.sendBulkNotification(fcmTokens, {
        title,
        body: message,
        data: {
          alertId: alert.id || '',
          level,
          type,
          advice,
          isAutomatic: 'true',
        },
      });

      alert.sentCount = result.successCount;

      if (result.failedTokens.length > 0) {
        await this.cleanupFailedTokens(result.failedTokens);
      }
    }

    return this.alertRepository.save(alert);
  }

  /**
   * Check if a duplicate alert exists within the specified hours
   */
  async checkDuplicateAlert(
    type: AlertType,
    level: AlertLevel,
    stationId: string,
    withinHours: number = 2,
  ): Promise<boolean> {
    const since = new Date(Date.now() - withinHours * 60 * 60 * 1000);

    const existingAlert = await this.alertRepository.findOne({
      where: {
        type,
        level,
        stationId,
        isAutomatic: true,
        sentAt: MoreThan(since),
      },
    });

    return !!existingAlert;
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
    const {
      page = 1,
      limit = 10,
      level,
      type,
      status,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;
    const now = new Date();

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

    // Filter by status (active/expired)
    if (status === 'active') {
      queryBuilder.andWhere(
        '(alert.expiresAt IS NULL OR alert.expiresAt > :now)',
        { now },
      );
    } else if (status === 'expired') {
      queryBuilder.andWhere(
        'alert.expiresAt IS NOT NULL AND alert.expiresAt <= :now',
        { now },
      );
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

  /**
   * Get alert statistics
   */
  async getStatistics(): Promise<{
    total: number;
    activeCount: number;
    byLevel: { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number };
  }> {
    // Get total alerts count
    const total = await this.alertRepository.count();

    // Get active alerts count
    const activeAlerts = await this.getActiveAlerts();
    const activeCount = activeAlerts.length;

    // Get alerts by level
    const byLevelRaw = await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('alert.level')
      .getRawMany();

    const byLevel = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    byLevelRaw.forEach((item) => {
      if (item.level in byLevel) {
        byLevel[item.level as keyof typeof byLevel] = parseInt(item.count, 10);
      }
    });

    return {
      total,
      activeCount,
      byLevel,
    };
  }

  /**
   * Get alert trend data for the last 30 days
   */
  async getAlertTrend(): Promise<Array<{ date: string; count: number }>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rawData = await this.alertRepository
      .createQueryBuilder('alert')
      .select('DATE(alert.sentAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('alert.sentAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('DATE(alert.sentAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return rawData.map((item) => ({
      date: item.date,
      count: parseInt(item.count, 10),
    }));
  }

  /**
   * Cleanup failed FCM tokens
   */
  private async cleanupFailedTokens(failedTokens: string[]): Promise<void> {
    if (failedTokens.length === 0) return;

    try {
      // Find users with these tokens and clear them
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.fcmToken IN (:...tokens)', { tokens: failedTokens })
        .select(['user.id'])
        .getMany();

      const userIds = users.map((u) => u.id);

      if (userIds.length > 0) {
        await this.userService.clearInvalidFcmTokens(userIds);
        this.logger.log(`Cleaned up ${userIds.length} invalid FCM tokens`);
      }
    } catch (error) {
      this.logger.error('Error cleaning up failed tokens:', error);
    }
  }
}

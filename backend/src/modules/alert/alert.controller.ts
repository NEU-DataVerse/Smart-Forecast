import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { AlertScheduler } from './alert.scheduler';
import { FcmCleanupScheduler } from './fcm-cleanup.scheduler';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertQueryDto } from './dto/alert-query.dto';
import { AlertEntity } from './entities/alert.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

@ApiTags('Alert')
@ApiBearerAuth()
@Controller('alert')
@UseGuards(JwtAuthGuard)
export class AlertController {
  constructor(
    private readonly alertService: AlertService,
    private readonly alertScheduler: AlertScheduler,
    private readonly fcmCleanupScheduler: FcmCleanupScheduler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create and send alert to users (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Alert created and sent successfully',
    type: AlertEntity,
  })
  async create(
    @Body() createDto: CreateAlertDto,
    @Request() req?: any,
  ): Promise<AlertEntity> {
    // In production, get adminId from authenticated request
    const adminId = req?.user?.id || '00000000-0000-0000-0000-000000000000';
    return this.alertService.createAndSend(createDto, adminId);
  }

  @Get()
  @ApiOperation({ summary: 'Get alert history with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
  })
  async findAll(@Query() query: AlertQueryDto): Promise<{
    data: AlertEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.alertService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get currently active alerts (not expired)' })
  @ApiResponse({
    status: 200,
    description: 'Active alerts retrieved successfully',
    type: [AlertEntity],
  })
  async getActive(): Promise<AlertEntity[]> {
    return this.alertService.getActiveAlerts();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get alert statistics by level' })
  @ApiResponse({
    status: 200,
    description: 'Alert statistics retrieved successfully',
  })
  async getStats(): Promise<{
    total: number;
    activeCount: number;
    byLevel: { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number };
  }> {
    return this.alertService.getStatistics();
  }

  @Get('stats/trend')
  @ApiOperation({ summary: 'Get daily alert count for the last 30 days' })
  @ApiResponse({
    status: 200,
    description: 'Alert trend data retrieved successfully',
  })
  async getAlertTrend(): Promise<Array<{ date: string; count: number }>> {
    return this.alertService.getAlertTrend();
  }

  @Post('trigger-check')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Manually trigger threshold check (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Threshold check triggered successfully',
  })
  async triggerThresholdCheck(): Promise<{ message: string }> {
    return this.alertScheduler.triggerCheck();
  }

  @Post('cleanup-tokens')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Manually trigger FCM token cleanup (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Token cleanup completed',
  })
  async cleanupTokens(): Promise<{ message: string; cleanedCount: number }> {
    return this.fcmCleanupScheduler.triggerCleanup();
  }
}

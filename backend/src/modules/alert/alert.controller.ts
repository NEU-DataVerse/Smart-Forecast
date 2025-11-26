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
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create and send alert to all users (Admin only)' })
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
}

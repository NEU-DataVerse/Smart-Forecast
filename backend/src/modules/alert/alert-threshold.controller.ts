import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AlertThresholdService } from './alert-threshold.service';
import { AlertThresholdEntity } from './entities/alert-threshold.entity';
import { CreateAlertThresholdDto } from './dto/create-alert-threshold.dto';
import { UpdateAlertThresholdDto } from './dto/update-alert-threshold.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

@ApiTags('Alert Thresholds')
@ApiBearerAuth()
@Controller('alert/thresholds')
@UseGuards(JwtAuthGuard)
export class AlertThresholdController {
  constructor(private readonly thresholdService: AlertThresholdService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new alert threshold (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Threshold created successfully',
    type: AlertThresholdEntity,
  })
  @ApiResponse({ status: 409, description: 'Threshold already exists' })
  async create(
    @Body() createDto: CreateAlertThresholdDto,
  ): Promise<AlertThresholdEntity> {
    return this.thresholdService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alert thresholds' })
  @ApiResponse({
    status: 200,
    description: 'Thresholds retrieved successfully',
    type: [AlertThresholdEntity],
  })
  async findAll(): Promise<AlertThresholdEntity[]> {
    return this.thresholdService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get only active thresholds' })
  @ApiResponse({
    status: 200,
    description: 'Active thresholds retrieved successfully',
    type: [AlertThresholdEntity],
  })
  async findActive(): Promise<AlertThresholdEntity[]> {
    return this.thresholdService.findActiveThresholds();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get threshold by ID' })
  @ApiParam({ name: 'id', description: 'Threshold UUID' })
  @ApiResponse({
    status: 200,
    description: 'Threshold found',
    type: AlertThresholdEntity,
  })
  @ApiResponse({ status: 404, description: 'Threshold not found' })
  async findById(@Param('id') id: string): Promise<AlertThresholdEntity> {
    return this.thresholdService.findById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update threshold (Admin only)' })
  @ApiParam({ name: 'id', description: 'Threshold UUID' })
  @ApiResponse({
    status: 200,
    description: 'Threshold updated successfully',
    type: AlertThresholdEntity,
  })
  @ApiResponse({ status: 404, description: 'Threshold not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAlertThresholdDto,
  ): Promise<AlertThresholdEntity> {
    return this.thresholdService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete threshold (Admin only)' })
  @ApiParam({ name: 'id', description: 'Threshold UUID' })
  @ApiResponse({ status: 204, description: 'Threshold deleted successfully' })
  @ApiResponse({ status: 404, description: 'Threshold not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.thresholdService.remove(id);
  }

  @Post(':id/toggle')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle threshold active status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Threshold UUID' })
  @ApiResponse({
    status: 200,
    description: 'Threshold status toggled',
    type: AlertThresholdEntity,
  })
  @ApiResponse({ status: 404, description: 'Threshold not found' })
  async toggleActive(@Param('id') id: string): Promise<AlertThresholdEntity> {
    return this.thresholdService.toggleActive(id);
  }
}

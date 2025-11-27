import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';
import { IncidentEntity } from './entities/incident.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

@ApiTags('Incident')
@ApiBearerAuth()
@Controller('incident')
@UseGuards(JwtAuthGuard)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create incident report (User/Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Incident created successfully',
    type: IncidentEntity,
  })
  async create(
    @Body() createDto: CreateIncidentDto,
    @Request() req?: any,
  ): Promise<IncidentEntity> {
    // In production, get userId from authenticated request
    const userId = req?.user?.id || '00000000-0000-0000-0000-000000000000';
    return this.incidentService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incidents with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Incidents retrieved successfully',
  })
  async findAll(@Query() query: IncidentQueryDto): Promise<{
    data: IncidentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.incidentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiParam({ name: 'id', description: 'Incident UUID' })
  @ApiResponse({
    status: 200,
    description: 'Incident found',
    type: IncidentEntity,
  })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async findOne(@Param('id') id: string): Promise<IncidentEntity> {
    return this.incidentService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update incident status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Incident UUID' })
  @ApiResponse({
    status: 200,
    description: 'Incident status updated successfully',
    type: IncidentEntity,
  })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateIncidentStatusDto,
    @Request() req?: any,
  ): Promise<IncidentEntity> {
    // In production, get adminId from authenticated request
    const adminId = req?.user?.id || '00000000-0000-0000-0000-000000000000';
    return this.incidentService.updateStatus(id, updateDto, adminId);
  }

  @Get('stats/by-type')
  @ApiOperation({ summary: 'Get incident statistics by type' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatsByType(): Promise<Array<{ type: string; count: number }>> {
    return this.incidentService.getStatsByType();
  }

  @Get('stats/by-status')
  @ApiOperation({ summary: 'Get incident statistics by status' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatsByStatus(): Promise<Array<{ status: string; count: number }>> {
    return this.incidentService.getStatsByStatus();
  }

  @Get('stats/trend')
  @ApiOperation({ summary: 'Get daily incident count for the last 30 days' })
  @ApiResponse({
    status: 200,
    description: 'Incident trend retrieved successfully',
  })
  async getIncidentTrend(): Promise<Array<{ date: string; count: number }>> {
    return this.incidentService.getIncidentTrend();
  }
}

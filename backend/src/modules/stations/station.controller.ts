import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StationService } from './station.service';
import { StationEntity } from './entities/station.entity';
import {
  CreateStationDto,
  UpdateStationDto,
  StationQueryDto,
  NearestStationQueryDto,
} from './dto/station.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Station Controller
 * REST API endpoints for managing weather stations
 */
@ApiTags('Stations')
@ApiBearerAuth()
@Controller('stations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StationController {
  constructor(private readonly stationManager: StationService) {}

  /**
   * Get all stations with optional filtering
   */
  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all stations',
    description: 'Retrieve all weather stations with optional status filter',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by station status',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of results to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'List of weather stations',
  })
  async getAllStations(@Query() query: StationQueryDto): Promise<{
    count: number;
    stations: StationEntity[];
  }> {
    const stations = await this.stationManager.findAll(query);
    return {
      count: stations.length,
      stations,
    };
  }

  /**
   * Find nearest station(s) based on GPS coordinates
   */
  @Get('nearest')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Find nearest stations by GPS coordinates',
    description:
      'Find the nearest weather station(s) based on latitude and longitude',
  })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude coordinate' })
  @ApiQuery({
    name: 'lon',
    required: true,
    description: 'Longitude coordinate',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    description: 'Search radius in km (default: 50)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Max stations to return (default: 1)',
  })
  @ApiResponse({ status: 200, description: 'Nearest station(s) with distance' })
  async findNearestStation(@Query() query: NearestStationQueryDto): Promise<{
    coordinates: { lat: number; lon: number };
    radius: number;
    count: number;
    stations: Array<StationEntity & { distance: number }>;
  }> {
    const radius = query.radius || 50;
    const limit = query.limit || 1;
    const stations = await this.stationManager.findNearest(
      query.lat,
      query.lon,
      radius,
      limit,
    );

    return {
      coordinates: { lat: query.lat, lon: query.lon },
      radius,
      count: stations.length,
      stations,
    };
  }

  /**
   * Get station statistics
   */
  @Get('stats')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get station statistics',
    description:
      'Get count of stations by status (total, active, inactive, maintenance)',
  })
  @ApiResponse({ status: 200, description: 'Station statistics' })
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
  }> {
    return await this.stationManager.getStatistics();
  }

  /**
   * Get station by ID
   */
  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get station by ID' })
  @ApiParam({ name: 'id', description: 'Station ID (URN format)' })
  @ApiResponse({ status: 200, description: 'Station details' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getStationById(@Param('id') id: string): Promise<StationEntity> {
    return this.stationManager.findById(id);
  }

  /**
   * Create a new station
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new station' })
  @ApiResponse({ status: 201, description: 'Station created successfully' })
  async createStation(@Body() createDto: CreateStationDto): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.create(createDto);
    return { message: 'Station created successfully', station };
  }

  /**
   * Update a station
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station updated successfully' })
  async updateStation(
    @Param('id') id: string,
    @Body() updateDto: UpdateStationDto,
  ): Promise<{ message: string; station: StationEntity }> {
    const station = await this.stationManager.update(id, updateDto);
    return { message: 'Station updated successfully', station };
  }

  /**
   * Delete a station
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 204, description: 'Station deleted successfully' })
  async deleteStation(@Param('id') id: string): Promise<void> {
    await this.stationManager.delete(id);
  }

  /**
   * Activate a station
   */
  @Post(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activate a station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station activated successfully' })
  async activateStation(@Param('id') id: string): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.activate(id);
    return { message: 'Station activated successfully', station };
  }

  /**
   * Deactivate a station
   */
  @Post(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate a station' })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station deactivated successfully' })
  async deactivateStation(@Param('id') id: string): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.deactivate(id);
    return { message: 'Station deactivated successfully', station };
  }

  /**
   * Set station to maintenance mode
   */
  @Post(':id/maintenance')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Set station to maintenance mode',
    description:
      'Set station status to maintenance (excluded from data ingestion)',
  })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({ status: 200, description: 'Station set to maintenance mode' })
  async setMaintenanceMode(@Param('id') id: string): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.setMaintenance(id);
    return { message: 'Station set to maintenance mode', station };
  }
}

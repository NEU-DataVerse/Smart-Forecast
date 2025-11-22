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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { StationService } from './station.service';
import { StationEntity } from './entities/station.entity';
import {
  CreateStationDto,
  UpdateStationDto,
  StationQueryDto,
  BatchStationOperationDto,
} from './dto/station.dto';

/**
 * Station Controller
 * REST API endpoints for managing weather stations
 */
@ApiTags('Stations')
@Controller('stations')
export class StationController {
  constructor(private readonly stationManager: StationService) {}

  /**
   * Get all stations with optional filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get all stations',
    description:
      'Retrieve all weather stations with optional filtering by city, district, status, etc.',
  })
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filter by city name',
  })
  @ApiQuery({
    name: 'district',
    required: false,
    description: 'Filter by district name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by station status',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    description: 'Filter by priority level',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
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
   * Get only active stations
   */
  @Get('active')
  @ApiOperation({
    summary: 'Get active stations',
    description:
      'Retrieve only active weather stations (used for data ingestion)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active weather stations',
  })
  async getActiveStations(): Promise<{
    count: number;
    stations: StationEntity[];
  }> {
    const stations = await this.stationManager.findActive();
    return {
      count: stations.length,
      stations,
    };
  }

  /**
   * Get station statistics
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get station statistics',
    description: 'Get comprehensive statistics about all stations',
  })
  @ApiResponse({
    status: 200,
    description: 'Station statistics',
  })
  async getStatistics() {
    const stats = await this.stationManager.getStatistics();
    return {
      message: 'Station statistics',
      ...stats,
    };
  }

  /**
   * Get data source information
   */
  @Get('info')
  @ApiOperation({
    summary: 'Get data source info',
    description: 'Get information about the station data source file',
  })
  @ApiResponse({
    status: 200,
    description: 'Data source information',
  })
  async getDataSourceInfo() {
    return this.stationManager.getDataSourceInfo();
  }

  /**
   * Get stations by city
   */
  @Get('city/:city')
  @ApiOperation({
    summary: 'Get stations by city',
    description: 'Retrieve all stations in a specific city',
  })
  @ApiParam({ name: 'city', description: 'City name' })
  @ApiResponse({
    status: 200,
    description: 'List of stations in the city',
  })
  async getStationsByCity(@Param('city') city: string): Promise<{
    city: string;
    count: number;
    stations: StationEntity[];
  }> {
    const stations = await this.stationManager.findByCity(city);
    return {
      city,
      count: stations.length,
      stations,
    };
  }

  /**
   * Get stations by district
   */
  @Get('district/:district')
  @ApiOperation({
    summary: 'Get stations by district',
    description: 'Retrieve all stations in a specific district',
  })
  @ApiParam({ name: 'district', description: 'District name' })
  @ApiResponse({
    status: 200,
    description: 'List of stations in the district',
  })
  async getStationsByDistrict(@Param('district') district: string): Promise<{
    district: string;
    count: number;
    stations: StationEntity[];
  }> {
    const stations = await this.stationManager.findByDistrict(district);
    return {
      district,
      count: stations.length,
      stations,
    };
  }

  /**
   * Get station by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get station by ID',
    description: 'Retrieve a specific station by its ID',
  })
  @ApiParam({ name: 'id', description: 'Station ID (URN format)' })
  @ApiResponse({
    status: 200,
    description: 'Station details',
  })
  @ApiResponse({
    status: 404,
    description: 'Station not found',
  })
  async getStationById(@Param('id') id: string): Promise<StationEntity> {
    return this.stationManager.findById(id);
  }

  /**
   * Create a new station
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new station',
    description: 'Add a new weather station to the system',
  })
  @ApiResponse({
    status: 201,
    description: 'Station created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async createStation(@Body() createDto: CreateStationDto): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.create(createDto);
    return {
      message: 'Station created successfully',
      station,
    };
  }

  /**
   * Update a station
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update a station',
    description: 'Update an existing weather station',
  })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({
    status: 200,
    description: 'Station updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Station not found',
  })
  async updateStation(
    @Param('id') id: string,
    @Body() updateDto: UpdateStationDto,
  ): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.update(id, updateDto);
    return {
      message: 'Station updated successfully',
      station,
    };
  }

  /**
   * Delete a station
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a station',
    description: 'Remove a weather station from the system',
  })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({
    status: 204,
    description: 'Station deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Station not found',
  })
  async deleteStation(@Param('id') id: string): Promise<void> {
    await this.stationManager.delete(id);
  }

  /**
   * Activate a station
   */
  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate a station',
    description:
      'Set station status to active (will be included in data ingestion)',
  })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({
    status: 200,
    description: 'Station activated successfully',
  })
  async activateStation(@Param('id') id: string): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.activate(id);
    return {
      message: 'Station activated successfully',
      station,
    };
  }

  /**
   * Deactivate a station
   */
  @Post(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate a station',
    description:
      'Set station status to inactive (will be excluded from data ingestion)',
  })
  @ApiParam({ name: 'id', description: 'Station ID' })
  @ApiResponse({
    status: 200,
    description: 'Station deactivated successfully',
  })
  async deactivateStation(@Param('id') id: string): Promise<{
    message: string;
    station: StationEntity;
  }> {
    const station = await this.stationManager.deactivate(id);
    return {
      message: 'Station deactivated successfully',
      station,
    };
  }

  /**
   * Batch operations on stations
   */
  @Post('batch')
  @ApiOperation({
    summary: 'Batch operations',
    description:
      'Perform batch operations (activate, deactivate, delete) on multiple stations',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch operation completed',
  })
  async batchOperation(@Body() batchDto: BatchStationOperationDto): Promise<{
    message: string;
    success: number;
    failed: number;
  }> {
    let result: { success: number; failed: number };

    switch (batchDto.operation) {
      case 'activate':
        result = await this.stationManager.batchActivate(batchDto.stationIds);
        break;
      case 'deactivate':
        result = await this.stationManager.batchDeactivate(batchDto.stationIds);
        break;
      case 'delete':
        result = { success: 0, failed: 0 };
        for (const id of batchDto.stationIds) {
          try {
            await this.stationManager.delete(id);
            result.success++;
          } catch {
            result.failed++;
          }
        }
        break;
      default:
        throw new Error(`Unknown operation: ${String(batchDto.operation)}`);
    }

    return {
      message: `Batch ${batchDto.operation} completed`,
      ...result,
    };
  }
}

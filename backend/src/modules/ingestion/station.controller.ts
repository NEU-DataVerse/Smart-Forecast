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
import { StationManagerService } from './providers/station-manager.provider';
import type { WeatherStation } from './dto/station.dto';
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
  constructor(private readonly stationManager: StationManagerService) {}

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
  getAllStations(@Query() query: StationQueryDto): {
    count: number;
    stations: WeatherStation[];
  } {
    const stations = this.stationManager.findAll(query);
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
  getActiveStations(): {
    count: number;
    stations: WeatherStation[];
  } {
    const stations = this.stationManager.findActive();
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
  getStatistics() {
    const stats = this.stationManager.getStatistics();
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
  getDataSourceInfo() {
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
  getStationsByCity(@Param('city') city: string): {
    city: string;
    count: number;
    stations: WeatherStation[];
  } {
    const stations = this.stationManager.findByCity(city);
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
  getStationsByDistrict(@Param('district') district: string): {
    district: string;
    count: number;
    stations: WeatherStation[];
  } {
    const stations = this.stationManager.findByDistrict(district);
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
  getStationById(@Param('id') id: string): WeatherStation {
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
    station: WeatherStation;
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
    station: WeatherStation;
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
    station: WeatherStation;
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
    station: WeatherStation;
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

  /**
   * Import stations from JSON
   */
  @Post('import')
  @ApiOperation({
    summary: 'Import stations',
    description: 'Import multiple stations from JSON array',
  })
  @ApiResponse({
    status: 200,
    description: 'Import completed',
  })
  async importStations(@Body() stations: Partial<WeatherStation>[]): Promise<{
    message: string;
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const result = await this.stationManager.importStations(stations);
    return {
      message: 'Import completed',
      ...result,
    };
  }

  /**
   * Export stations to JSON
   */
  @Get('export/all')
  @ApiOperation({
    summary: 'Export all stations',
    description: 'Export all stations to JSON format',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Include inactive stations',
  })
  @ApiResponse({
    status: 200,
    description: 'Stations exported',
  })
  exportStations(
    @Query('includeInactive') includeInactive?: boolean,
  ): WeatherStation[] {
    return this.stationManager.exportStations(includeInactive);
  }

  /**
   * Reload stations from file
   */
  @Post('reload')
  @ApiOperation({
    summary: 'Reload stations',
    description: 'Reload stations from source_data.json file',
  })
  @ApiResponse({
    status: 200,
    description: 'Stations reloaded successfully',
  })
  async reloadStations(): Promise<{
    message: string;
    info: any;
  }> {
    await this.stationManager.reload();
    const info = this.stationManager.getDataSourceInfo();
    return {
      message: 'Stations reloaded successfully',
      info,
    };
  }
}

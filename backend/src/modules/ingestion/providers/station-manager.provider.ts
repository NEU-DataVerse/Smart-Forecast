import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  WeatherStation,
  StationDataSource,
  CreateStationDto,
  UpdateStationDto,
  StationQueryDto,
  StationStatus,
  StationPriority,
} from '../dto/station.dto';

/**
 * Station Manager Service
 * Manages weather stations from source_data.json
 * Provides CRUD operations and querying capabilities
 */
@Injectable()
export class StationManagerService {
  private readonly logger = new Logger(StationManagerService.name);
  private readonly dataFilePath: string;
  private stations: WeatherStation[] = [];
  private dataSource: StationDataSource;

  constructor() {
    this.dataFilePath = join(__dirname, '../source_data.json');
    void this.loadStations();
  }

  /**
   * Load stations from JSON file
   */
  private async loadStations(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf-8');
      const jsonData = JSON.parse(data);

      // Support both old and new format
      if (Array.isArray(jsonData)) {
        // Old format - convert to new format
        this.dataSource = {
          version: '1.0',
          lastUpdated: new Date().toISOString(),
          stations: jsonData.map((station, index) => ({
            ...station,
            id: station.id || this.generateStationId(station.name),
            type: station.type || 'WeatherStation',
            status: StationStatus.ACTIVE,
            timezone: station.timezone || 'Asia/Ho_Chi_Minh',
            code: `ST-${String(index + 1).padStart(3, '0')}`,
          })),
        };
      } else {
        // New format
        this.dataSource = jsonData;
      }

      this.stations = this.dataSource.stations;
      this.logger.log(
        `Loaded ${this.stations.length} stations from source_data.json`,
      );
    } catch (error) {
      this.logger.error('Failed to load stations from file', error.message);
      // Initialize with empty data if file doesn't exist
      this.dataSource = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        stations: [],
      };
      this.stations = [];
    }
  }

  /**
   * Save stations to JSON file
   */
  private async saveStations(): Promise<void> {
    try {
      this.dataSource.lastUpdated = new Date().toISOString();
      this.dataSource.stations = this.stations;

      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(this.dataSource, null, 2),
        'utf-8',
      );
      this.logger.log('Successfully saved stations to source_data.json');
    } catch (error) {
      this.logger.error('Failed to save stations to file', error.message);
      throw error;
    }
  }

  /**
   * Generate station ID from name
   */
  private generateStationId(name: string): string {
    const normalized = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `urn:ngsi-ld:WeatherStation:${normalized}`;
  }

  /**
   * Get all stations with optional filtering
   */
  findAll(query?: StationQueryDto): WeatherStation[] {
    let filtered = [...this.stations];

    if (query) {
      if (query.city) {
        filtered = filtered.filter(
          (s) => s.city?.toLowerCase() === query.city?.toLowerCase(),
        );
      }
      if (query.district) {
        filtered = filtered.filter(
          (s) => s.district?.toLowerCase() === query.district?.toLowerCase(),
        );
      }
      if (query.status) {
        filtered = filtered.filter((s) => s.status === query.status);
      }
      if (query.priority) {
        filtered = filtered.filter((s) => s.priority === query.priority);
      }
      if (query.category) {
        filtered = filtered.filter((s) =>
          s.categories?.includes(query.category!),
        );
      }

      // Pagination
      const offset = query.offset || 0;
      const limit = query.limit || filtered.length;
      filtered = filtered.slice(offset, offset + limit);
    }

    return filtered;
  }

  /**
   * Get active stations only (for ingestion)
   */
  findActive(): WeatherStation[] {
    return this.stations.filter((s) => s.status === StationStatus.ACTIVE);
  }

  /**
   * Get station by ID
   */
  findById(id: string): WeatherStation {
    const station = this.stations.find((s) => s.id === id);
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return station;
  }

  /**
   * Get station by code
   */
  findByCode(code: string): WeatherStation {
    const station = this.stations.find((s) => s.code === code);
    if (!station) {
      throw new NotFoundException(`Station with code ${code} not found`);
    }
    return station;
  }

  /**
   * Get stations by city
   */
  findByCity(city: string): WeatherStation[] {
    return this.stations.filter(
      (s) => s.city?.toLowerCase() === city.toLowerCase(),
    );
  }

  /**
   * Get stations by district
   */
  findByDistrict(district: string): WeatherStation[] {
    return this.stations.filter(
      (s) => s.district?.toLowerCase() === district.toLowerCase(),
    );
  }

  /**
   * Create a new station
   */
  async create(createDto: CreateStationDto): Promise<WeatherStation> {
    const newStation: WeatherStation = {
      id: this.generateStationId(createDto.name),
      type: 'WeatherStation',
      name: createDto.name,
      code:
        createDto.code ||
        `ST-${String(this.stations.length + 1).padStart(3, '0')}`,
      status: StationStatus.ACTIVE,
      city: createDto.city,
      district: createDto.district,
      ward: createDto.ward,
      location: createDto.location,
      address: createDto.address,
      timezone: createDto.timezone || 'Asia/Ho_Chi_Minh',
      timezoneOffset: 25200, // UTC+7
      priority: createDto.priority || StationPriority.MEDIUM,
      categories: createDto.categories || [],
      metadata: {
        ...createDto.metadata,
        installationDate: new Date().toISOString(),
      },
    };

    this.stations.push(newStation);
    await this.saveStations();

    this.logger.log(
      `Created new station: ${newStation.name} (${newStation.id})`,
    );
    return newStation;
  }

  /**
   * Update a station
   */
  async update(
    id: string,
    updateDto: UpdateStationDto,
  ): Promise<WeatherStation> {
    const index = this.stations.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    this.stations[index] = {
      ...this.stations[index],
      ...updateDto,
    };

    await this.saveStations();

    this.logger.log(`Updated station: ${this.stations[index].name} (${id})`);
    return this.stations[index];
  }

  /**
   * Delete a station
   */
  async delete(id: string): Promise<void> {
    const index = this.stations.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    const station = this.stations[index];
    this.stations.splice(index, 1);
    await this.saveStations();

    this.logger.log(`Deleted station: ${station.name} (${id})`);
  }

  /**
   * Activate a station
   */
  async activate(id: string): Promise<WeatherStation> {
    return this.update(id, { status: StationStatus.ACTIVE });
  }

  /**
   * Deactivate a station
   */
  async deactivate(id: string): Promise<WeatherStation> {
    return this.update(id, { status: StationStatus.INACTIVE });
  }

  /**
   * Batch activate stations
   */
  async batchActivate(
    ids: string[],
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await this.activate(id);
        success++;
      } catch (error) {
        failed++;
        this.logger.error(`Failed to activate station ${id}`, error.message);
      }
    }

    return { success, failed };
  }

  /**
   * Batch deactivate stations
   */
  async batchDeactivate(
    ids: string[],
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await this.deactivate(id);
        success++;
      } catch (error) {
        failed++;
        this.logger.error(`Failed to deactivate station ${id}`, error.message);
      }
    }

    return { success, failed };
  }

  /**
   * Get station statistics
   */
  getStatistics(): {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    retired: number;
    byCity: Record<string, number>;
    byPriority: Record<string, number>;
  } {
    const stats = {
      total: this.stations.length,
      active: 0,
      inactive: 0,
      maintenance: 0,
      retired: 0,
      byCity: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    for (const station of this.stations) {
      // Count by status
      if (station.status === StationStatus.ACTIVE) stats.active++;
      else if (station.status === StationStatus.INACTIVE) stats.inactive++;
      else if (station.status === StationStatus.MAINTENANCE)
        stats.maintenance++;
      else if (station.status === StationStatus.RETIRED) stats.retired++;

      // Count by city
      if (station.city) {
        stats.byCity[station.city] = (stats.byCity[station.city] || 0) + 1;
      }

      // Count by priority
      if (station.priority) {
        stats.byPriority[station.priority] =
          (stats.byPriority[station.priority] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Import stations from JSON array
   */
  async importStations(stations: Partial<WeatherStation>[]): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const stationData of stations) {
      try {
        // Check if station already exists
        const exists = this.stations.find(
          (s) => s.id === stationData.id || s.name === stationData.name,
        );

        if (exists) {
          skipped++;
          continue;
        }

        // Validate required fields
        if (
          !stationData.name ||
          !stationData.district ||
          !stationData.location ||
          !stationData.address
        ) {
          errors.push(
            `Missing required fields for station: ${stationData.name || 'unknown'}`,
          );
          skipped++;
          continue;
        }

        // Create station
        const newStation: WeatherStation = {
          id: stationData.id || this.generateStationId(stationData.name),
          type: stationData.type || 'WeatherStation',
          name: stationData.name,
          code:
            stationData.code ||
            `ST-${String(this.stations.length + 1).padStart(3, '0')}`,
          status: stationData.status || StationStatus.ACTIVE,
          city: stationData.city,
          district: stationData.district,
          ward: stationData.ward,
          location: stationData.location,
          address: stationData.address,
          timezone: stationData.timezone || 'Asia/Ho_Chi_Minh',
          timezoneOffset: stationData.timezoneOffset || 25200,
          priority: stationData.priority || StationPriority.MEDIUM,
          categories: stationData.categories || [],
          metadata: stationData.metadata || {},
        };

        this.stations.push(newStation);
        imported++;
      } catch (error) {
        errors.push(`Failed to import ${stationData.name}: ${error.message}`);
      }
    }

    if (imported > 0) {
      await this.saveStations();
    }

    this.logger.log(
      `Imported ${imported} stations, skipped ${skipped}, errors: ${errors.length}`,
    );
    return { imported, skipped, errors };
  }

  /**
   * Export stations to JSON array
   */
  exportStations(includeInactive = false): WeatherStation[] {
    if (includeInactive) {
      return this.stations;
    }
    return this.stations.filter((s) => s.status === StationStatus.ACTIVE);
  }

  /**
   * Reload stations from file
   */
  async reload(): Promise<void> {
    await this.loadStations();
  }

  /**
   * Get data source info
   */
  getDataSourceInfo(): {
    version: string;
    lastUpdated: string;
    stationCount: number;
  } {
    return {
      version: this.dataSource.version,
      lastUpdated: this.dataSource.lastUpdated,
      stationCount: this.stations.length,
    };
  }
}

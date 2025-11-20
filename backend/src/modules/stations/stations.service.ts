import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IStation } from '@smart-forecast/shared';
import sourceLocationsData from '../ingestion/source_data.json';

/**
 * Stations Service
 *
 * Manages monitoring station data loaded from source_data.json
 */
@Injectable()
export class StationsService {
  private readonly logger = new Logger(StationsService.name);
  private readonly stations: IStation[];

  constructor() {
    // Load and cache stations from JSON file
    this.stations = sourceLocationsData as unknown as IStation[];
    this.logger.log(`Loaded ${this.stations.length} monitoring stations`);
  }

  /**
   * Get all stations, optionally filtered by city
   */
  getAllStations(city?: string): IStation[] {
    if (!city) {
      return this.stations;
    }

    return this.stations.filter(
      (station) => station.city?.toLowerCase() === city.toLowerCase(),
    );
  }

  /**
   * Get station by ID
   * @throws NotFoundException if station not found
   */
  getStationById(id: string): IStation {
    const station = this.stations.find((s) => s.id === id);

    if (!station) {
      throw new NotFoundException(`Station with ID '${id}' not found`);
    }

    return station;
  }

  /**
   * Check if station exists
   */
  stationExists(id: string): boolean {
    return this.stations.some((s) => s.id === id);
  }

  /**
   * Get all unique cities
   */
  getCities(): string[] {
    const cities = new Set(
      this.stations.map((s) => s.city).filter((city) => city),
    );
    return Array.from(cities);
  }
}

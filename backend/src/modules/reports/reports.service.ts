import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { IncidentEntity } from '../incident/entities/incident.entity';
import { StationEntity } from '../stations/entities/station.entity';
import {
  ExportQueryDto,
  ExportFormat,
  REPORT_LIMITS,
  IncidentExportQueryDto,
  StationExportQueryDto,
  BaseExportQueryDto,
} from './dto/export-query.dto';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';

/**
 * Path to fonts directory for Vietnamese support
 * Using Roboto font which supports Vietnamese characters
 */
const FONTS_DIR = path.join(__dirname, '..', '..', '..', 'assets', 'fonts');

/**
 * Reports Service
 * Handles data export functionality for weather, air quality, incidents, and stations
 */
@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private fontPath: string | null = null;

  constructor(
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepo: Repository<WeatherObservedEntity>,
    @InjectRepository(AirQualityObservedEntity)
    private readonly airQualityRepo: Repository<AirQualityObservedEntity>,
    @InjectRepository(IncidentEntity)
    private readonly incidentRepo: Repository<IncidentEntity>,
    @InjectRepository(StationEntity)
    private readonly stationRepo: Repository<StationEntity>,
  ) {
    this.initializeFonts();
  }

  /**
   * Initialize fonts for Vietnamese support
   */
  private initializeFonts(): void {
    // Try to find a font that supports Vietnamese
    const possibleFonts = [
      path.join(FONTS_DIR, 'Roboto-Regular.ttf'),
      path.join(FONTS_DIR, 'NotoSans-Regular.ttf'),
      path.join(FONTS_DIR, 'DejaVuSans.ttf'),
    ];

    for (const fontPath of possibleFonts) {
      if (fs.existsSync(fontPath)) {
        // Validate font file is not empty and has correct header
        try {
          const stats = fs.statSync(fontPath);
          if (stats.size < 1000) {
            this.logger.warn(`Font file ${fontPath} seems too small, skipping`);
            continue;
          }

          // Check for TTF/OTF magic bytes
          const buffer = Buffer.alloc(4);
          const fd = fs.openSync(fontPath, 'r');
          fs.readSync(fd, buffer, 0, 4, 0);
          fs.closeSync(fd);

          // TTF starts with 0x00010000 or 'true', OTF starts with 'OTTO'
          const magic = buffer.toString('hex');
          const isTTF =
            magic === '00010000' ||
            buffer.toString('ascii') === 'true' ||
            buffer.toString('ascii') === 'OTTO';

          if (!isTTF) {
            this.logger.warn(
              `Font file ${fontPath} has invalid format (magic: ${magic}), skipping`,
            );
            continue;
          }

          this.fontPath = fontPath;
          this.logger.log(`Using font for Vietnamese support: ${fontPath}`);
          break;
        } catch (error) {
          this.logger.warn(`Error validating font ${fontPath}: ${error}`);
          continue;
        }
      }
    }

    if (!this.fontPath) {
      this.logger.warn(
        'No Vietnamese-compatible font found. PDF reports may not display Vietnamese characters correctly. ' +
          `Please add a Unicode font (e.g., Roboto, NotoSans) to ${FONTS_DIR}`,
      );
    }
  }

  /**
   * Create a new PDF document with Vietnamese font support
   */
  private createPDFDocument(): PDFKit.PDFDocument {
    const doc = new PDFDocument({ margin: 50 });

    // Register and use Vietnamese-compatible font if available
    if (this.fontPath) {
      try {
        doc.registerFont('Vietnamese', this.fontPath);
        doc.font('Vietnamese');
      } catch (error) {
        this.logger.warn(
          `Failed to load font ${this.fontPath}, using default font: ${error}`,
        );
        // Reset fontPath to avoid retrying
        this.fontPath = null;
      }
    }

    return doc;
  }

  /**
   * Validate query parameters
   */
  private validateQuery(query: ExportQueryDto): void {
    if (query.hasPartialDateRange()) {
      throw new BadRequestException(
        'Both startDate and endDate must be provided together',
      );
    }
    query.validateDateRange();
  }

  /**
   * Get limit from query with fallback to default
   */
  private getLimit(query: BaseExportQueryDto): number {
    return Math.min(query.limit || REPORT_LIMITS.DEFAULT, REPORT_LIMITS.MAX);
  }

  /**
   * Export weather data
   */
  async exportWeather(query: ExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting weather data: ${JSON.stringify(query)}`);
    this.validateQuery(query);

    const where: any = {};

    if (query.stationId) {
      where.locationId = query.stationId;
    }

    if (query.startDate && query.endDate) {
      where.dateObserved = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    const limit = this.getLimit(query);
    const data = await this.weatherRepo.find({
      where,
      order: { dateObserved: 'DESC' },
      take: limit,
    });

    this.logger.log(`Found ${data.length} weather records for export`);

    if (query.format === ExportFormat.CSV) {
      return this.exportWeatherToCSV(data);
    } else {
      return this.exportWeatherToPDF(data, query);
    }
  }

  /**
   * Export air quality data
   */
  async exportAirQuality(query: ExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting air quality data: ${JSON.stringify(query)}`);
    this.validateQuery(query);

    const where: any = {};

    if (query.stationId) {
      where.locationId = query.stationId;
    }

    if (query.startDate && query.endDate) {
      where.dateObserved = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    const limit = this.getLimit(query);
    const data = await this.airQualityRepo.find({
      where,
      order: { dateObserved: 'DESC' },
      take: limit,
    });

    this.logger.log(`Found ${data.length} air quality records for export`);

    if (query.format === ExportFormat.CSV) {
      return this.exportAirQualityToCSV(data);
    } else {
      return this.exportAirQualityToPDF(data, query);
    }
  }

  /**
   * Export incidents data
   */
  async exportIncidents(query: IncidentExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting incidents data: ${JSON.stringify(query)}`);

    if (query.hasPartialDateRange()) {
      throw new BadRequestException(
        'Both startDate and endDate must be provided together',
      );
    }
    query.validateDateRange();

    const where: any = {};

    if (query.startDate && query.endDate) {
      where.createdAt = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    const limit = this.getLimit(query);
    const data = await this.incidentRepo.find({
      where,
      relations: ['reportedBy', 'verifiedBy'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    this.logger.log(`Found ${data.length} incidents for export`);

    if (query.format === ExportFormat.CSV) {
      return this.exportIncidentsToCSV(data);
    } else {
      return this.exportIncidentsToPDF(data, query);
    }
  }

  /**
   * Export stations data
   */
  async exportStations(query: StationExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting stations data`);

    const data = await this.stationRepo.find({
      order: { city: 'ASC', district: 'ASC' },
    });

    this.logger.log(`Found ${data.length} stations for export`);

    if (query.format === ExportFormat.CSV) {
      return this.exportStationsToCSV(data);
    } else {
      return this.exportStationsToPDF(data);
    }
  }

  // ============ CSV Export Methods ============

  private exportWeatherToCSV(data: WeatherObservedEntity[]): Buffer {
    const fields = [
      'entityId',
      'locationId',
      'dateObserved',
      'temperature',
      'feelsLikeTemperature',
      'relativeHumidity',
      'atmosphericPressure',
      'windSpeed',
      'windDirection',
      'precipitation',
      'weatherType',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    return Buffer.from(csv, 'utf-8');
  }

  private exportAirQualityToCSV(data: AirQualityObservedEntity[]): Buffer {
    const fields = [
      'entityId',
      'locationId',
      'dateObserved',
      'airQualityIndex',
      'airQualityLevel',
      'pm25',
      'pm10',
      'co',
      'no2',
      'so2',
      'o3',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    return Buffer.from(csv, 'utf-8');
  }

  private exportIncidentsToCSV(data: IncidentEntity[]): Buffer {
    const formatted = data.map((incident) => ({
      id: incident.id,
      type: incident.type,
      status: incident.status,
      description: incident.description,
      latitude: incident.location?.coordinates?.[1],
      longitude: incident.location?.coordinates?.[0],
      reportedBy: incident.reportedBy?.email || incident.reportedBy,
      verifiedBy: incident.verifiedBy?.email || incident.verifiedBy,
      createdAt: incident.createdAt,
    }));

    const fields = [
      'id',
      'type',
      'status',
      'description',
      'latitude',
      'longitude',
      'reportedBy',
      'verifiedBy',
      'createdAt',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formatted);
    return Buffer.from(csv, 'utf-8');
  }

  private exportStationsToCSV(data: StationEntity[]): Buffer {
    const formatted = data.map((station) => ({
      id: station.id,
      name: station.name,
      city: station.city,
      district: station.district,
      address: JSON.stringify(station.address),
      latitude: station.location?.lat,
      longitude: station.location?.lon,
      status: station.status,
      categories: station.categories?.join(', ') || '',
      priority: station.priority,
    }));

    const fields = [
      'id',
      'name',
      'city',
      'district',
      'address',
      'latitude',
      'longitude',
      'status',
      'categories',
      'priority',
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formatted);
    return Buffer.from(csv, 'utf-8');
  }

  // ============ PDF Export Methods ============

  private exportWeatherToPDF(
    data: WeatherObservedEntity[],
    query: ExportQueryDto,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createPDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) =>
          reject(err instanceof Error ? err : new Error(String(err))),
        );

        // Header
        doc.fontSize(20).text('Weather Data Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, {
          align: 'center',
        });
        if (query.startDate && query.endDate) {
          doc.text(
            `Period: ${new Date(query.startDate).toLocaleDateString()} - ${new Date(query.endDate).toLocaleDateString()}`,
            { align: 'center' },
          );
        }
        doc.moveDown(2);

        // Summary
        doc
          .fontSize(14)
          .text(`Total Records: ${data.length}`, { align: 'left' });
        doc.moveDown();

        // Data table
        const maxDisplay = REPORT_LIMITS.PDF_MAX_DISPLAY;
        doc.fontSize(10);
        data.slice(0, maxDisplay).forEach((item, index) => {
          doc.text(
            `${index + 1}. ${item.locationId} - ${new Date(item.dateObserved).toLocaleString()}`,
          );
          doc.text(
            `   Temp: ${item.temperature}°C, Humidity: ${item.relativeHumidity}%, Wind: ${item.windSpeed}m/s`,
          );
          doc.moveDown(0.5);

          if (doc.y > 700) {
            doc.addPage();
          }
        });

        if (data.length > maxDisplay) {
          doc.text(`... and ${data.length - maxDisplay} more records`);
        }

        doc.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private exportAirQualityToPDF(
    data: AirQualityObservedEntity[],
    query: ExportQueryDto,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createPDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) =>
          reject(err instanceof Error ? err : new Error(String(err))),
        );

        // Header
        doc.fontSize(20).text('Air Quality Data Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, {
          align: 'center',
        });
        if (query.startDate && query.endDate) {
          doc.text(
            `Period: ${new Date(query.startDate).toLocaleDateString()} - ${new Date(query.endDate).toLocaleDateString()}`,
            { align: 'center' },
          );
        }
        doc.moveDown(2);

        // Summary
        doc
          .fontSize(14)
          .text(`Total Records: ${data.length}`, { align: 'left' });
        doc.moveDown();

        // Data table
        const maxDisplay = REPORT_LIMITS.PDF_MAX_DISPLAY;
        doc.fontSize(10);
        data.slice(0, maxDisplay).forEach((item, index) => {
          doc.text(
            `${index + 1}. ${item.locationId} - ${new Date(item.dateObserved).toLocaleString()}`,
          );
          doc.text(
            `   AQI: ${item.airQualityIndex} (${item.airQualityLevel}), PM2.5: ${item.pm25}, PM10: ${item.pm10}`,
          );
          doc.moveDown(0.5);

          if (doc.y > 700) {
            doc.addPage();
          }
        });

        if (data.length > maxDisplay) {
          doc.text(`... and ${data.length - maxDisplay} more records`);
        }

        doc.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private exportIncidentsToPDF(
    data: IncidentEntity[],
    query: IncidentExportQueryDto,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createPDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) =>
          reject(err instanceof Error ? err : new Error(String(err))),
        );

        // Header
        doc.fontSize(20).text('Incident Reports', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, {
          align: 'center',
        });
        if (query.startDate && query.endDate) {
          doc.text(
            `Period: ${new Date(query.startDate).toLocaleDateString()} - ${new Date(query.endDate).toLocaleDateString()}`,
            { align: 'center' },
          );
        }
        doc.moveDown(2);

        // Summary
        const byType = data.reduce(
          (acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        doc
          .fontSize(14)
          .text(`Total Incidents: ${data.length}`, { align: 'left' });
        doc.fontSize(12);
        Object.entries(byType).forEach(([type, count]) => {
          doc.text(`  ${type}: ${count}`);
        });
        doc.moveDown(2);

        // Data table
        const maxDisplay = REPORT_LIMITS.PDF_INCIDENTS_MAX_DISPLAY;
        doc.fontSize(10);
        data.slice(0, maxDisplay).forEach((item, index) => {
          doc.text(
            `${index + 1}. [${item.status}] ${item.type} - ${new Date(item.createdAt).toLocaleString()}`,
          );
          const description = item.description || '';
          doc.text(
            `   ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`,
          );
          doc.text(`   ReportedBy: ${item.reportedBy?.id || 'N/A'}`);
          doc.moveDown(0.5);

          if (doc.y > 700) {
            doc.addPage();
          }
        });

        if (data.length > maxDisplay) {
          doc.text(`... and ${data.length - maxDisplay} more incidents`);
        }

        doc.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private exportStationsToPDF(data: StationEntity[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = this.createPDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) =>
          reject(err instanceof Error ? err : new Error(String(err))),
        );

        // Header
        doc
          .fontSize(20)
          .text('Monitoring Stations Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, {
          align: 'center',
        });
        doc.moveDown(2);

        // Summary
        const byCity = data.reduce(
          (acc, item) => {
            const cityKey = item.city || 'Unknown';
            acc[cityKey] = (acc[cityKey] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        doc
          .fontSize(14)
          .text(`Total Stations: ${data.length}`, { align: 'left' });
        doc.fontSize(12);
        Object.entries(byCity).forEach(([city, count]) => {
          doc.text(`  ${city}: ${count} stations`);
        });
        doc.moveDown(2);

        // Data table
        doc.fontSize(10);
        data.forEach((item, index) => {
          doc.text(`${index + 1}. ${item.name} (${item.status})`);
          const addressStr = item.address?.addressLocality || 'N/A';
          doc.text(
            `   ${addressStr}, ${item.district || 'N/A'}, ${item.city || 'N/A'}`,
          );
          const categoriesStr = item.categories?.join(', ') || 'N/A';
          doc.text(
            `   Categories: ${categoriesStr}, Priority: ${item.priority}`,
          );
          doc.moveDown(0.5);

          if (doc.y > 700) {
            doc.addPage();
          }
        });

        doc.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
}

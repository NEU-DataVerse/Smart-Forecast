import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WeatherObservedEntity } from '../persistence/entities/weather-observed.entity';
import { AirQualityObservedEntity } from '../persistence/entities/air-quality-observed.entity';
import { IncidentEntity } from '../incident/entities/incident.entity';
import { StationEntity } from '../stations/entities/station.entity';
import { ExportQueryDto, ExportFormat } from './dto/export-query.dto';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(WeatherObservedEntity)
    private readonly weatherRepo: Repository<WeatherObservedEntity>,
    @InjectRepository(AirQualityObservedEntity)
    private readonly airQualityRepo: Repository<AirQualityObservedEntity>,
    @InjectRepository(IncidentEntity)
    private readonly incidentRepo: Repository<IncidentEntity>,
    @InjectRepository(StationEntity)
    private readonly stationRepo: Repository<StationEntity>,
  ) {}

  /**
   * Export weather data
   */
  async exportWeather(query: ExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting weather data: ${JSON.stringify(query)}`);

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

    const data = await this.weatherRepo.find({
      where,
      order: { dateObserved: 'DESC' },
      take: 1000, // Limit for performance
    });

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

    const data = await this.airQualityRepo.find({
      where,
      order: { dateObserved: 'DESC' },
      take: 1000,
    });

    if (query.format === ExportFormat.CSV) {
      return this.exportAirQualityToCSV(data);
    } else {
      return this.exportAirQualityToPDF(data, query);
    }
  }

  /**
   * Export incidents data
   */
  async exportIncidents(query: ExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting incidents data: ${JSON.stringify(query)}`);

    const where: any = {};

    if (query.startDate && query.endDate) {
      where.createdAt = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    const data = await this.incidentRepo.find({
      where,
      relations: ['reporter', 'verifier'],
      order: { createdAt: 'DESC' },
      take: 1000,
    });

    if (query.format === ExportFormat.CSV) {
      return this.exportIncidentsToCSV(data);
    } else {
      return this.exportIncidentsToPDF(data, query);
    }
  }

  /**
   * Export stations data
   */
  async exportStations(query: ExportQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting stations data`);

    const data = await this.stationRepo.find({
      order: { city: 'ASC', district: 'ASC' },
    });

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
      reportedBy: incident.reporter?.email || incident.reportedBy,
      verifiedBy: incident.verifier?.email || incident.verifiedBy,
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
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Weather Data Report', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      if (query.startDate && query.endDate) {
        doc.text(
          `Period: ${new Date(query.startDate).toLocaleDateString()} - ${new Date(query.endDate).toLocaleDateString()}`,
          { align: 'center' },
        );
      }
      doc.moveDown(2);

      // Summary
      doc.fontSize(14).text(`Total Records: ${data.length}`, { align: 'left' });
      doc.moveDown();

      // Data table
      doc.fontSize(10);
      data.slice(0, 50).forEach((item, index) => {
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

      if (data.length > 50) {
        doc.text(`... and ${data.length - 50} more records`);
      }

      doc.end();
    });
  }

  private exportAirQualityToPDF(
    data: AirQualityObservedEntity[],
    query: ExportQueryDto,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Air Quality Data Report', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      if (query.startDate && query.endDate) {
        doc.text(
          `Period: ${new Date(query.startDate).toLocaleDateString()} - ${new Date(query.endDate).toLocaleDateString()}`,
          { align: 'center' },
        );
      }
      doc.moveDown(2);

      // Summary
      doc.fontSize(14).text(`Total Records: ${data.length}`, { align: 'left' });
      doc.moveDown();

      // Data table
      doc.fontSize(10);
      data.slice(0, 50).forEach((item, index) => {
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

      if (data.length > 50) {
        doc.text(`... and ${data.length - 50} more records`);
      }

      doc.end();
    });
  }

  private exportIncidentsToPDF(
    data: IncidentEntity[],
    query: ExportQueryDto,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Incident Reports', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
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
      doc.fontSize(10);
      data.slice(0, 30).forEach((item, index) => {
        doc.text(
          `${index + 1}. [${item.status}] ${item.type} - ${new Date(item.createdAt).toLocaleString()}`,
        );
        doc.text(`   ${item.description.substring(0, 100)}...`);
        doc.text(`   Reporter: ${item.reporter?.email || item.reportedBy}`);
        doc.moveDown(0.5);

        if (doc.y > 700) {
          doc.addPage();
        }
      });

      if (data.length > 30) {
        doc.text(`... and ${data.length - 30} more incidents`);
      }

      doc.end();
    });
  }

  private exportStationsToPDF(data: StationEntity[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Monitoring Stations Report', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
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
        doc.text(`   ${addressStr}, ${item.district}, ${item.city || 'N/A'}`);
        const categoriesStr = item.categories?.join(', ') || 'N/A';
        doc.text(`   Categories: ${categoriesStr}, Priority: ${item.priority}`);
        doc.moveDown(0.5);

        if (doc.y > 700) {
          doc.addPage();
        }
      });

      doc.end();
    });
  }
}

import {
  Controller,
  Get,
  Query,
  UseGuards,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { ExportQueryDto, ExportFormat } from './dto/export-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@smart-forecast/shared';

/**
 * Reports Controller
 * Endpoints for exporting data reports in PDF/CSV format
 */
@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Export weather data report
   * GET /api/v1/reports/weather
   */
  @Get('weather')
  @ApiOperation({
    summary: 'Export weather data report (Admin only)',
    description: 'Export weather statistics and data in PDF or CSV format',
  })
  @ApiQuery({
    name: 'format',
    enum: ExportFormat,
    required: false,
    description: 'Export format (pdf or csv)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
  })
  async exportWeather(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Exporting weather report: ${JSON.stringify(query)}`);

    const buffer = await this.reportsService.exportWeather(query);

    const format = query.format || ExportFormat.PDF;
    const filename = `weather-report-${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader(
      'Content-Type',
      format === ExportFormat.PDF ? 'application/pdf' : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.status(HttpStatus.OK).send(buffer);
  }

  /**
   * Export air quality data report
   * GET /api/v1/reports/air-quality
   */
  @Get('air-quality')
  @ApiOperation({
    summary: 'Export air quality data report (Admin only)',
    description: 'Export AQI statistics and data in PDF or CSV format',
  })
  @ApiQuery({
    name: 'format',
    enum: ExportFormat,
    required: false,
    description: 'Export format (pdf or csv)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
  })
  async exportAirQuality(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Exporting air quality report: ${JSON.stringify(query)}`);

    const buffer = await this.reportsService.exportAirQuality(query);

    const format = query.format || ExportFormat.PDF;
    const filename = `air-quality-report-${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader(
      'Content-Type',
      format === ExportFormat.PDF ? 'application/pdf' : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.status(HttpStatus.OK).send(buffer);
  }

  /**
   * Export incidents report
   * GET /api/v1/reports/incidents
   */
  @Get('incidents')
  @ApiOperation({
    summary: 'Export incidents report (Admin only)',
    description: 'Export incident statistics and data in PDF or CSV format',
  })
  @ApiQuery({
    name: 'format',
    enum: ExportFormat,
    required: false,
    description: 'Export format (pdf or csv)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
  })
  async exportIncidents(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Exporting incidents report: ${JSON.stringify(query)}`);

    const buffer = await this.reportsService.exportIncidents(query);

    const format = query.format || ExportFormat.PDF;
    const filename = `incidents-report-${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader(
      'Content-Type',
      format === ExportFormat.PDF ? 'application/pdf' : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.status(HttpStatus.OK).send(buffer);
  }

  /**
   * Export stations report
   * GET /api/v1/reports/stations
   */
  @Get('stations')
  @ApiOperation({
    summary: 'Export monitoring stations report (Admin only)',
    description: 'Export stations list and information in PDF or CSV format',
  })
  @ApiQuery({
    name: 'format',
    enum: ExportFormat,
    required: false,
    description: 'Export format (pdf or csv)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
  })
  async exportStations(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Exporting stations report`);

    const buffer = await this.reportsService.exportStations(query);

    const format = query.format || ExportFormat.PDF;
    const filename = `stations-report-${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader(
      'Content-Type',
      format === ExportFormat.PDF ? 'application/pdf' : 'text/csv',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.status(HttpStatus.OK).send(buffer);
  }
}

import {
  Controller,
  Get,
  Query,
  UseGuards,
  Logger,
  Res,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import {
  ExportQueryDto,
  ExportFormat,
  IncidentExportQueryDto,
  StationExportQueryDto,
} from './dto/export-query.dto';
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
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing token',
})
@ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Send file response with appropriate headers
   */
  private sendFileResponse(
    res: Response,
    buffer: Buffer,
    filename: string,
    format: ExportFormat,
  ): void {
    const contentType =
      format === ExportFormat.PDF ? 'application/pdf' : 'text/csv';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.status(HttpStatus.OK).send(buffer);
  }

  /**
   * Generate filename with date suffix
   */
  private generateFilename(prefix: string, format: ExportFormat): string {
    const dateStr = new Date().toISOString().split('T')[0];
    return `${prefix}-${dateStr}.${format}`;
  }

  /**
   * Handle export errors consistently
   */
  private handleExportError(error: unknown, reportType: string): never {
    this.logger.error(
      `Failed to export ${reportType} report: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error.stack : undefined,
    );

    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException(
      `Failed to generate ${reportType} report. Please try again later.`,
    );
  }

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
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiInternalServerErrorResponse({ description: 'Failed to generate report' })
  async exportWeather(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Exporting weather report: ${JSON.stringify(query)}`);

      const buffer = await this.reportsService.exportWeather(query);
      const format = query.format || ExportFormat.PDF;
      const filename = this.generateFilename('weather-report', format);

      this.sendFileResponse(res, buffer, filename, format);
    } catch (error) {
      this.handleExportError(error, 'weather');
    }
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
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiInternalServerErrorResponse({ description: 'Failed to generate report' })
  async exportAirQuality(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Exporting air quality report: ${JSON.stringify(query)}`);

      const buffer = await this.reportsService.exportAirQuality(query);
      const format = query.format || ExportFormat.PDF;
      const filename = this.generateFilename('air-quality-report', format);

      this.sendFileResponse(res, buffer, filename, format);
    } catch (error) {
      this.handleExportError(error, 'air quality');
    }
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
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiInternalServerErrorResponse({ description: 'Failed to generate report' })
  async exportIncidents(
    @Query() query: IncidentExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Exporting incidents report: ${JSON.stringify(query)}`);

      const buffer = await this.reportsService.exportIncidents(query);
      const format = query.format || ExportFormat.PDF;
      const filename = this.generateFilename('incidents-report', format);

      this.sendFileResponse(res, buffer, filename, format);
    } catch (error) {
      this.handleExportError(error, 'incidents');
    }
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
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiInternalServerErrorResponse({ description: 'Failed to generate report' })
  async exportStations(
    @Query() query: StationExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Exporting stations report`);

      const buffer = await this.reportsService.exportStations(query);
      const format = query.format || ExportFormat.PDF;
      const filename = this.generateFilename('stations-report', format);

      this.sendFileResponse(res, buffer, filename, format);
    } catch (error) {
      this.handleExportError(error, 'stations');
    }
  }
}

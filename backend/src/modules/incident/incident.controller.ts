import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { IncidentService } from './incident.service';
import { CreateIncidentMultipartDto } from './dto/create-incident-multipart.dto';
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
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
          callback(
            new BadRequestException(
              'Only JPEG, JPG, and PNG images are allowed',
            ),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create incident report with images (User/Admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['type', 'description', 'longitude', 'latitude', 'images'],
      properties: {
        type: {
          type: 'string',
          enum: [
            'FLOODING',
            'FALLEN_TREE',
            'LANDSLIDE',
            'AIR_POLLUTION',
            'ROAD_DAMAGE',
            'OTHER',
          ],
          example: 'FLOODING',
        },
        description: {
          type: 'string',
          example: 'Ngập nước nghiêm trọng tại đường Lê Duẩn',
        },
        longitude: {
          type: 'string',
          example: '105.8342',
        },
        latitude: {
          type: 'string',
          example: '21.0278',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Upload 1-5 images (JPEG/PNG, max 5MB each)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Incident created successfully',
    type: IncidentEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'At least one image is required',
  })
  async create(
    @Body() createDto: CreateIncidentMultipartDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ): Promise<IncidentEntity> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    const userId = req?.user?.id;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return this.incidentService.create(createDto, userId, files);
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

  @Get('my-reports')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current user incidents (User/Admin)' })
  @ApiResponse({
    status: 200,
    description: 'User incidents retrieved successfully',
  })
  async findMyReports(
    @Query() query: IncidentQueryDto,
    @Request() req: any,
  ): Promise<{
    data: IncidentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const userId = req?.user?.id;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return this.incidentService.findByUser(userId, query);
  }

  @Get('stats/by-type')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get incident statistics by type (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatsByType(): Promise<Array<{ type: string; count: number }>> {
    return this.incidentService.getStatsByType();
  }

  @Get('stats/by-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get incident statistics by status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatsByStatus(): Promise<Array<{ status: string; count: number }>> {
    return this.incidentService.getStatsByStatus();
  }

  @Get('stats/trend')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get daily incident count for the last 30 days (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Incident trend retrieved successfully',
  })
  async getIncidentTrend(): Promise<Array<{ date: string; count: number }>> {
    return this.incidentService.getIncidentTrend();
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
    @Request() req: any,
  ): Promise<IncidentEntity> {
    const adminId = req?.user?.id;
    if (!adminId) {
      throw new BadRequestException('Admin authentication required');
    }
    return this.incidentService.updateStatus(id, updateDto, adminId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete incident (Admin only)' })
  @ApiParam({ name: 'id', description: 'Incident UUID' })
  @ApiResponse({
    status: 204,
    description: 'Incident deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.incidentService.remove(id);
  }
}

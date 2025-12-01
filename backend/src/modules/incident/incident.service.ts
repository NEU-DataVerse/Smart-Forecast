import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentEntity } from './entities/incident.entity';
import { CreateIncidentMultipartDto } from './dto/create-incident-multipart.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';
import { FileService } from '../file/file.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
    private readonly fileService: FileService,
  ) {}

  /**
   * Create a new incident report with image upload
   */
  async create(
    createDto: CreateIncidentMultipartDto,
    userId: string,
    files: Express.Multer.File[],
  ): Promise<IncidentEntity> {
    // Validate at least 1 image is required
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    // Upload images to MinIO
    const imageUrls = await this.fileService.uploadMultipleImages(files);

    // Build location GeoJSON
    const location = {
      type: 'Point' as const,
      coordinates: [
        parseFloat(createDto.longitude),
        parseFloat(createDto.latitude),
      ] as [number, number],
    };

    const incident = this.incidentRepository.create({
      type: createDto.type,
      description: createDto.description,
      location,
      imageUrls,
      reportedBy: { id: userId } as User,
    });

    return this.incidentRepository.save(incident);
  }

  /**
   * Find all incidents with filters and pagination
   */
  async findAll(query: IncidentQueryDto): Promise<{
    data: IncidentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      startDate,
      endDate,
      reportedBy,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.incidentRepository
      .createQueryBuilder('incident')
      .leftJoinAndSelect('incident.reportedBy', 'reporter')
      .leftJoinAndSelect('incident.verifiedBy', 'verifier');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('incident.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('incident.type = :type', { type });
    }

    if (reportedBy) {
      queryBuilder.andWhere('reporter.id = :reportedBy', {
        reportedBy,
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'incident.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      );
    }

    // Apply pagination and sorting
    queryBuilder.skip(skip).take(limit).orderBy('incident.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Find incident by ID with relations
   */
  async findOne(id: string): Promise<IncidentEntity> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['reportedBy', 'verifiedBy'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return incident;
  }

  /**
   * Update incident status (Admin only)
   */
  async updateStatus(
    id: string,
    updateDto: UpdateIncidentStatusDto,
    adminId: string,
  ): Promise<IncidentEntity> {
    const incident = await this.findOne(id);

    // Update fields
    incident.status = updateDto.status;
    incident.verifiedBy = { id: adminId } as User;
    incident.adminNotes = updateDto.notes || incident.adminNotes;

    await this.incidentRepository.save(incident);

    // Return the updated incident
    return this.findOne(id);
  }

  /**
   * Delete incident (hard delete with image cleanup)
   */
  async remove(id: string): Promise<void> {
    const incident = await this.findOne(id);

    // Delete images from MinIO
    if (incident.imageUrls && incident.imageUrls.length > 0) {
      for (const url of incident.imageUrls) {
        try {
          // Extract filename from URL (last part after /)
          const fileName = url.split('/').pop();
          if (fileName) {
            await this.fileService.deleteFile(fileName);
          }
        } catch (error) {
          // Log error but continue with deletion
          console.error(`Failed to delete image: ${url}`, error);
        }
      }
    }

    await this.incidentRepository.remove(incident);
  }

  /**
   * Find all incidents by user (for my-reports endpoint)
   */
  async findByUser(
    userId: string,
    query: IncidentQueryDto,
  ): Promise<{
    data: IncidentEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.findAll({ ...query, reportedBy: userId });
  }

  /**
   * Get incident statistics by type
   */
  async getStatsByType(): Promise<Array<{ type: string; count: number }>> {
    const rawStats = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.type')
      .getRawMany();

    // PostgreSQL returns COUNT as string, convert to number
    return rawStats.map((stat) => ({
      type: stat.type,
      count: Number(stat.count),
    }));
  }

  /**
   * Get incident statistics by status
   */
  async getStatsByStatus(): Promise<Array<{ status: string; count: number }>> {
    const rawStats = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.status')
      .getRawMany();

    // PostgreSQL returns COUNT as string, convert to number
    return rawStats.map((stat) => ({
      status: stat.status,
      count: Number(stat.count),
    }));
  }

  /**
   * Get daily incident count for the last 30 days
   */
  async getIncidentTrend(): Promise<Array<{ date: string; count: number }>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const rawTrend = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('DATE(incident.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('incident.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('DATE(incident.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // PostgreSQL returns COUNT as string, convert to number
    return rawTrend.map((item) => ({
      date: item.date,
      count: Number(item.count),
    }));
  }
}

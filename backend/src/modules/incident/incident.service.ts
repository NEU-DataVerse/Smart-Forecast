import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IncidentEntity } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(IncidentEntity)
    private readonly incidentRepository: Repository<IncidentEntity>,
  ) {}

  /**
   * Create a new incident report
   */
  async create(
    createDto: CreateIncidentDto,
    userId: string,
  ): Promise<IncidentEntity> {
    const incident = this.incidentRepository.create({
      ...createDto,
      reportedBy: userId,
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
      .leftJoinAndSelect('incident.reporter', 'reporter')
      .leftJoinAndSelect('incident.verifier', 'verifier');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('incident.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('incident.type = :type', { type });
    }

    if (reportedBy) {
      queryBuilder.andWhere('incident.reportedBy = :reportedBy', {
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
      relations: ['reporter', 'verifier'],
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

    // Use update() to only modify specific fields
    await this.incidentRepository.update(id, {
      status: updateDto.status,
      verifiedBy: adminId,
      adminNotes: updateDto.notes || incident.adminNotes,
    });

    // Return the updated incident
    return this.findOne(id);
  }

  /**
   * Delete incident (soft delete by setting status to REJECTED)
   */
  async remove(id: string): Promise<void> {
    const incident = await this.findOne(id);
    await this.incidentRepository.remove(incident);
  }

  /**
   * Get incident statistics by type
   */
  async getStatsByType(): Promise<Array<{ type: string; count: number }>> {
    return this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.type')
      .getRawMany();
  }

  /**
   * Get incident statistics by status
   */
  async getStatsByStatus(): Promise<Array<{ status: string; count: number }>> {
    return this.incidentRepository
      .createQueryBuilder('incident')
      .select('incident.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('incident.status')
      .getRawMany();
  }

  /**
   * Get daily incident count for the last 30 days
   */
  async getIncidentTrend(): Promise<Array<{ date: string; count: number }>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.incidentRepository
      .createQueryBuilder('incident')
      .select('DATE(incident.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('incident.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('DATE(incident.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }
}

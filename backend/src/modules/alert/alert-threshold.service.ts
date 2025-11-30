import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertThresholdEntity } from './entities/alert-threshold.entity';
import { CreateAlertThresholdDto } from './dto/create-alert-threshold.dto';
import { UpdateAlertThresholdDto } from './dto/update-alert-threshold.dto';

@Injectable()
export class AlertThresholdService {
  constructor(
    @InjectRepository(AlertThresholdEntity)
    private readonly thresholdRepository: Repository<AlertThresholdEntity>,
  ) {}

  /**
   * Create a new alert threshold
   */
  async create(
    createDto: CreateAlertThresholdDto,
  ): Promise<AlertThresholdEntity> {
    // Check if similar threshold already exists
    const existing = await this.thresholdRepository.findOne({
      where: {
        type: createDto.type,
        metric: createDto.metric,
        operator: createDto.operator,
        value: createDto.value,
      },
    });

    if (existing) {
      throw new ConflictException(
        'A threshold with the same type, metric, operator and value already exists',
      );
    }

    const threshold = this.thresholdRepository.create(createDto);
    return this.thresholdRepository.save(threshold);
  }

  /**
   * Find all thresholds
   */
  async findAll(): Promise<AlertThresholdEntity[]> {
    return this.thresholdRepository.find({
      order: { type: 'ASC', metric: 'ASC', value: 'ASC' },
    });
  }

  /**
   * Find active thresholds only
   */
  async findActiveThresholds(): Promise<AlertThresholdEntity[]> {
    return this.thresholdRepository.find({
      where: { isActive: true },
      order: { type: 'ASC', metric: 'ASC', value: 'ASC' },
    });
  }

  /**
   * Find threshold by ID
   */
  async findById(id: string): Promise<AlertThresholdEntity> {
    const threshold = await this.thresholdRepository.findOne({ where: { id } });
    if (!threshold) {
      throw new NotFoundException(`Threshold with ID ${id} not found`);
    }
    return threshold;
  }

  /**
   * Update threshold
   */
  async update(
    id: string,
    updateDto: UpdateAlertThresholdDto,
  ): Promise<AlertThresholdEntity> {
    const threshold = await this.findById(id);
    Object.assign(threshold, updateDto);
    return this.thresholdRepository.save(threshold);
  }

  /**
   * Delete threshold
   */
  async remove(id: string): Promise<void> {
    const result = await this.thresholdRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Threshold with ID ${id} not found`);
    }
  }

  /**
   * Toggle threshold active status
   */
  async toggleActive(id: string): Promise<AlertThresholdEntity> {
    const threshold = await this.findById(id);
    threshold.isActive = !threshold.isActive;
    return this.thresholdRepository.save(threshold);
  }
}

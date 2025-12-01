import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { googleId } });
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<User> {
    const user = await this.findById(userId);
    user.fcmToken = fcmToken;
    user.fcmTokenUpdatedAt = new Date();
    return this.userRepository.save(user);
  }

  /**
   * Update user's current location
   * Called by mobile app when app opens
   */
  async updateLocation(
    userId: string,
    locationDto: UpdateLocationDto,
  ): Promise<User> {
    const user = await this.findById(userId);
    user.location = {
      type: 'Point',
      coordinates: [locationDto.longitude, locationDto.latitude], // GeoJSON: [lng, lat]
    };
    user.locationUpdatedAt = new Date();
    return this.userRepository.save(user);
  }

  /**
   * Find users within a geographic area with buffer
   * Uses PostGIS ST_DWithin for efficient spatial query
   */
  async findUsersInAreaWithBuffer(
    polygon: { type: 'Polygon'; coordinates: number[][][] },
    bufferKm: number = 5,
  ): Promise<User[]> {
    const bufferMeters = bufferKm * 1000;

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere('user.fcmToken IS NOT NULL')
      .andWhere('user.location IS NOT NULL')
      .andWhere(
        `ST_DWithin(
          "user"."location"::geography,
          ST_GeomFromGeoJSON(:polygon)::geography,
          :buffer
        )`,
        {
          polygon: JSON.stringify(polygon),
          buffer: bufferMeters,
        },
      )
      .getMany();
  }

  /**
   * Find all active users with valid FCM tokens
   */
  async findUsersWithFcmTokens(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      select: ['id', 'fcmToken', 'location'],
    });
  }

  /**
   * Remove invalid FCM token from user
   */
  async clearFcmToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      fcmToken: null as any,
      fcmTokenUpdatedAt: new Date(),
    });
  }

  /**
   * Bulk remove invalid FCM tokens
   */
  async clearInvalidFcmTokens(userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ fcmToken: null as any, fcmTokenUpdatedAt: new Date() })
      .whereInIds(userIds)
      .execute();
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}

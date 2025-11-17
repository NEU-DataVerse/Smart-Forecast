import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Service for interacting with Orion-LD Context Broker
 */
@Injectable()
export class OrionService {
  private readonly logger = new Logger(OrionService.name);
  private readonly orionUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.orionUrl =
      this.configService.get<string>('ORION_LD_URL') || 'http://localhost:1026';
  }

  /**
   * Create or update an entity in Orion-LD
   * @param entity NGSI-LD entity to upsert
   */
  async upsertEntity(entity: any): Promise<void> {
    try {
      const url = `${this.orionUrl}/ngsi-ld/v1/entities`;
      const headers = {
        'Content-Type': 'application/ld+json',
      };

      // Try to create the entity
      try {
        await firstValueFrom(this.httpService.post(url, entity, { headers }));
        this.logger.log(`Created entity: ${entity.id}`);
      } catch (createError: any) {
        // If entity already exists (409), update it instead
        if (createError.response?.status === 409) {
          await this.updateEntity(entity.id, entity);
        } else {
          throw createError;
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to upsert entity ${entity.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update an existing entity's attributes
   * @param entityId Entity ID
   * @param entity Entity data with updated attributes
   */
  async updateEntity(entityId: string, entity: any): Promise<void> {
    try {
      const url = `${this.orionUrl}/ngsi-ld/v1/entities/${encodeURIComponent(entityId)}/attrs`;
      const headers = {
        'Content-Type': 'application/ld+json',
      };

      // Remove id and type from the payload for update
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, type, ...attributes } = entity;

      await firstValueFrom(
        this.httpService.patch(url, attributes, { headers }),
      );
      this.logger.log(`Updated entity: ${entityId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update entity ${entityId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get an entity from Orion-LD by ID
   * @param entityId Entity ID
   * @returns Entity data
   */
  async getEntity(entityId: string): Promise<any> {
    try {
      const url = `${this.orionUrl}/ngsi-ld/v1/entities/${encodeURIComponent(entityId)}`;
      const headers = {
        Accept: 'application/ld+json',
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get entity ${entityId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Query entities by type
   * @param entityType Type of entities to query
   * @param limit Maximum number of results
   * @returns Array of entities
   */
  async queryEntities(entityType: string, limit = 100): Promise<any[]> {
    try {
      const url = `${this.orionUrl}/ngsi-ld/v1/entities`;
      const headers = {
        Accept: 'application/ld+json',
      };
      const params = {
        type: entityType,
        limit: limit.toString(),
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to query entities of type ${entityType}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

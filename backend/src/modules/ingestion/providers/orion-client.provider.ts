import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Orion-LD Context Broker Client
 * Handles communication with FIWARE Orion-LD Context Broker
 * Implements NGSI-LD API for entity management
 */
@Injectable()
export class OrionClientProvider {
  private readonly logger = new Logger(OrionClientProvider.name);
  private readonly httpClient: AxiosInstance;
  private readonly orionUrl: string;
  private readonly apiVersion: string;
  private readonly tenant: string;

  constructor(private configService: ConfigService) {
    this.orionUrl =
      this.configService.get<string>('orion.url') || 'http://localhost:1026';
    this.apiVersion =
      this.configService.get<string>('orion.apiVersion') || 'ngsi-ld/v1';
    this.tenant = this.configService.get<string>('orion.tenant') || '';

    const baseURL = `${this.orionUrl}/${this.apiVersion}`;

    this.logger.log(`Initializing Orion-LD client: ${baseURL}`);

    this.httpClient = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/ld+json',
        Accept: 'application/ld+json',
        ...(this.tenant && { 'NGSILD-Tenant': this.tenant }),
      },
    });
  }

  /**
   * Create a new entity in Orion-LD
   * POST /ngsi-ld/v1/entities
   *
   * @param entity NGSI-LD entity to create
   * @returns Created entity ID
   */
  async createEntity(entity: any): Promise<string> {
    try {
      this.logger.debug(`Creating entity: ${entity.id}`);

      await this.httpClient.post('/entities', entity);

      this.logger.log(`Successfully created entity: ${entity.id}`);
      return entity.id;
    } catch (error) {
      if (error.response?.status === 409) {
        this.logger.warn(
          `Entity already exists: ${entity.id}. Use upsert instead.`,
        );
        throw new Error(`Entity ${entity.id} already exists`);
      }

      this.logger.error(
        `Failed to create entity: ${entity.id}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Update an existing entity (partial update)
   * PATCH /ngsi-ld/v1/entities/{entityId}/attrs
   *
   * @param entityId Entity ID to update
   * @param attributes Attributes to update
   */
  async updateEntity(entityId: string, attributes: any): Promise<void> {
    try {
      this.logger.debug(`Updating entity: ${entityId}`);

      await this.httpClient.patch(
        `/entities/${encodeURIComponent(entityId)}/attrs`,
        attributes,
      );

      this.logger.log(`Successfully updated entity: ${entityId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update entity: ${entityId}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Upsert an entity (create if not exists, update if exists)
   * POST /ngsi-ld/v1/entityOperations/upsert
   *
   * @param entities Array of NGSI-LD entities to upsert
   * @returns Upsert result
   */
  async upsertEntities(entities: any[]): Promise<any> {
    try {
      this.logger.debug(`Upserting ${entities.length} entities`);

      const response = await this.httpClient.post(
        '/entityOperations/upsert',
        entities,
        {
          params: { options: 'update' },
        },
      );

      this.logger.log(`Successfully upserted ${entities.length} entities`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to upsert entities`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Upsert a single entity (helper method)
   *
   * @param entity NGSI-LD entity to upsert
   * @returns Upsert result
   */
  async upsertEntity(entity: any): Promise<any> {
    return this.upsertEntities([entity]);
  }

  /**
   * Get an entity by ID
   * GET /ngsi-ld/v1/entities/{entityId}
   *
   * @param entityId Entity ID to retrieve
   * @param options Query options (attrs, type, etc.)
   * @returns NGSI-LD entity
   */
  async getEntity(entityId: string, options?: any): Promise<any> {
    try {
      this.logger.debug(`Getting entity: ${entityId}`);

      const response = await this.httpClient.get(
        `/entities/${encodeURIComponent(entityId)}`,
        {
          params: options,
        },
      );

      this.logger.debug(`Successfully retrieved entity: ${entityId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        this.logger.warn(`Entity not found: ${entityId}`);
        return null;
      }

      this.logger.error(
        `Failed to get entity: ${entityId}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Query entities
   * GET /ngsi-ld/v1/entities
   *
   * @param options Query options (type, q, limit, offset, etc.)
   * @returns Array of NGSI-LD entities
   */
  async queryEntities(options?: any): Promise<any[]> {
    try {
      this.logger.debug(
        `Querying entities with options: ${JSON.stringify(options)}`,
      );

      const response = await this.httpClient.get('/entities', {
        params: options,
      });

      const entities = response.data;
      this.logger.debug(`Successfully retrieved ${entities.length} entities`);
      return entities;
    } catch (error) {
      this.logger.error(
        `Failed to query entities`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Delete an entity
   * DELETE /ngsi-ld/v1/entities/{entityId}
   *
   * @param entityId Entity ID to delete
   */
  async deleteEntity(entityId: string): Promise<void> {
    try {
      this.logger.debug(`Deleting entity: ${entityId}`);

      await this.httpClient.delete(`/entities/${encodeURIComponent(entityId)}`);

      this.logger.log(`Successfully deleted entity: ${entityId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        this.logger.warn(`Entity not found for deletion: ${entityId}`);
        return;
      }

      this.logger.error(
        `Failed to delete entity: ${entityId}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Create a subscription
   * POST /ngsi-ld/v1/subscriptions
   *
   * @param subscription NGSI-LD subscription object
   * @returns Subscription ID
   */
  async createSubscription(subscription: any): Promise<string> {
    try {
      this.logger.debug(`Creating subscription`);

      const response = await this.httpClient.post(
        '/subscriptions',
        subscription,
      );

      const subscriptionId = response.headers.location?.split('/').pop() || '';
      this.logger.log(`Successfully created subscription: ${subscriptionId}`);
      return subscriptionId;
    } catch (error) {
      this.logger.error(
        `Failed to create subscription`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Get all subscriptions
   * GET /ngsi-ld/v1/subscriptions
   *
   * @returns Array of subscriptions
   */
  async getSubscriptions(): Promise<any[]> {
    try {
      this.logger.debug(`Getting all subscriptions`);

      const response = await this.httpClient.get('/subscriptions');

      const subscriptions = response.data;
      this.logger.debug(
        `Successfully retrieved ${subscriptions.length} subscriptions`,
      );
      return subscriptions;
    } catch (error) {
      this.logger.error(
        `Failed to get subscriptions`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Delete a subscription
   * DELETE /ngsi-ld/v1/subscriptions/{subscriptionId}
   *
   * @param subscriptionId Subscription ID to delete
   */
  async deleteSubscription(subscriptionId: string): Promise<void> {
    try {
      this.logger.debug(`Deleting subscription: ${subscriptionId}`);

      await this.httpClient.delete(
        `/subscriptions/${encodeURIComponent(subscriptionId)}`,
      );

      this.logger.log(`Successfully deleted subscription: ${subscriptionId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete subscription: ${subscriptionId}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Health check - verify Orion-LD is accessible
   *
   * @returns true if Orion-LD is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.httpClient.get('/entities?limit=1');
      return true;
    } catch (error) {
      this.logger.error('Orion-LD health check failed', error.message);
      return false;
    }
  }
}

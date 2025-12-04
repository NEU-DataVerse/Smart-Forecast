import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrionClientProvider } from '../ingestion/providers/orion-client.provider';
import {
  QueryEntitiesDto,
  GetEntityByIdDto,
  AllowedEntityType,
  EntityTypeShortNames,
} from './dto/public-api.dto';

/**
 * Public NGSI-LD API Controller
 * Exposes read-only NGSI-LD entities for external consumers
 * No authentication required - designed for public demo access
 */
@ApiTags('Public NGSI-LD')
@Controller('public/ngsi-ld')
export class PublicApiController {
  constructor(private readonly orionClient: OrionClientProvider) {}

  /**
   * List available entity types
   * GET /api/v1/public/ngsi-ld/types
   */
  @Get('types')
  @Header('Content-Type', 'application/ld+json')
  @ApiOperation({
    summary: 'List available NGSI-LD entity types',
    description:
      'Returns the list of entity types available through this public API',
  })
  @ApiResponse({
    status: 200,
    description: 'List of available entity types',
  })
  getAvailableTypes() {
    const types = Object.values(AllowedEntityType).map((type) => ({
      type,
      description: this.getTypeDescription(type),
    }));

    return {
      '@context': 'https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld',
      typeList: types,
    };
  }

  /**
   * Query NGSI-LD entities
   * GET /api/v1/public/ngsi-ld/entities
   */
  @Get('entities')
  @Header('Content-Type', 'application/ld+json')
  @ApiOperation({
    summary: 'Query NGSI-LD entities',
    description:
      'Query entities from Orion-LD Context Broker with optional filters. Returns data in standard NGSI-LD JSON-LD format.',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of NGSI-LD entities in JSON-LD format',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  async queryEntities(@Query() query: QueryEntitiesDto) {
    // Build Orion query options
    const orionOptions: Record<string, any> = {
      limit: query.limit,
      offset: query.offset,
    };

    // Add type filter if specified - convert short name to full URI
    if (query.type) {
      const resolvedType = this.resolveEntityType(query.type);
      if (!resolvedType) {
        const allowedShortNames = Object.keys(EntityTypeShortNames).join(', ');
        throw new BadRequestException(
          `Invalid entity type '${query.type}'. Allowed types: ${allowedShortNames}`,
        );
      }
      orionOptions.type = resolvedType;
    }

    // Add query expression if specified
    if (query.q) {
      orionOptions.q = query.q;
    }

    // Add attribute filter if specified
    if (query.attrs) {
      orionOptions.attrs = query.attrs;
    }

    // Add geo-query parameters if specified
    if (query.georel && query.geometry && query.coordinates) {
      orionOptions.georel = query.georel;
      orionOptions.geometry = query.geometry;
      orionOptions.coordinates = query.coordinates;
      if (query.geoproperty) {
        orionOptions.geoproperty = query.geoproperty;
      }
    }

    try {
      const entities = await this.orionClient.queryEntities(orionOptions);
      return entities;
    } catch (error) {
      throw new BadRequestException(
        `Failed to query entities: ${error.message}`,
      );
    }
  }

  /**
   * Get a single entity by ID
   * GET /api/v1/public/ngsi-ld/entities/:id
   */
  @Get('entities/:id')
  @Header('Content-Type', 'application/ld+json')
  @ApiOperation({
    summary: 'Get entity by ID',
    description:
      'Retrieve a single NGSI-LD entity by its ID. Returns data in standard NGSI-LD JSON-LD format.',
  })
  @ApiParam({
    name: 'id',
    description: 'Entity ID (URN format)',
    example: 'urn:ngsi-ld:WeatherObserved:HN-HD-001',
  })
  @ApiResponse({
    status: 200,
    description: 'NGSI-LD entity in JSON-LD format',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity not found',
  })
  async getEntityById(
    @Param('id') id: string,
    @Query() query: GetEntityByIdDto,
  ) {
    // Validate entity ID format (should be URN)
    if (!id.startsWith('urn:ngsi-ld:')) {
      throw new BadRequestException(
        'Invalid entity ID format. Must be URN format (urn:ngsi-ld:...)',
      );
    }

    // Extract entity type from URN (e.g., urn:ngsi-ld:WeatherObserved:HN-001 -> WeatherObserved)
    const entityTypeShortName = id.split(':')[2];
    const allowedShortNames = Object.keys(EntityTypeShortNames);

    // Check if entity type is allowed (using short name from URN)
    if (!allowedShortNames.includes(entityTypeShortName)) {
      throw new BadRequestException(
        `Entity type '${entityTypeShortName}' is not accessible through this public API. Allowed types: ${allowedShortNames.join(', ')}`,
      );
    }

    try {
      const options: Record<string, any> = {};
      if (query.attrs) {
        options.attrs = query.attrs;
      }

      const entity = await this.orionClient.getEntity(id, options);

      if (!entity) {
        throw new NotFoundException(`Entity with ID '${id}' not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve entity: ${error.message}`,
      );
    }
  }

  /**
   * Helper method to get description for each entity type
   */
  private getTypeDescription(type: AllowedEntityType): string {
    const descriptions: Record<AllowedEntityType, string> = {
      [AllowedEntityType.WEATHER_OBSERVED]:
        'Current weather observations from weather stations',
      [AllowedEntityType.AIR_QUALITY_OBSERVED]:
        'Current air quality measurements (AQI, PM2.5, PM10, etc.)',
      [AllowedEntityType.WEATHER_FORECAST]: '7-day weather forecast data',
      [AllowedEntityType.AIR_QUALITY_FORECAST]:
        '4-day air quality forecast data',
      [AllowedEntityType.WEATHER_ALERT]: 'Weather alerts and warnings',
    };
    return descriptions[type];
  }

  /**
   * Helper method to resolve entity type from short name or full URI
   * Returns the full URI if valid, null otherwise
   */
  private resolveEntityType(type: string): string | null {
    // Check if it's already a full URI
    const allowedFullURIs = Object.values(AllowedEntityType) as string[];
    if (allowedFullURIs.includes(type)) {
      return type;
    }

    // Try to resolve from short name
    const fullUri = EntityTypeShortNames[type];
    return fullUri || null;
  }
}

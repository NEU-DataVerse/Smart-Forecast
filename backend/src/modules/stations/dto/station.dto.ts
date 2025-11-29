import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsObject,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Station DTOs for Weather Station Management
 */

export class StationLocationDto {
  @ApiProperty({ description: 'Latitude', example: 21.028511 })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude', example: 105.804817 })
  @IsNumber()
  lon: number;

  @ApiPropertyOptional({ description: 'Altitude in meters', example: 12 })
  @IsNumber()
  @IsOptional()
  altitude?: number;
}

export interface StationLocation {
  lat: number;
  lon: number;
  altitude?: number;
}

export class StationAddressDto {
  @ApiPropertyOptional({
    description: 'Street address',
    example: 'Hồ Hoàn Kiếm',
  })
  @IsString()
  @IsOptional()
  streetAddress?: string;

  @ApiProperty({ description: 'City/District', example: 'Hoàn Kiếm' })
  @IsString()
  addressLocality: string;

  @ApiPropertyOptional({ description: 'Region/Province', example: 'Hà Nội' })
  @IsString()
  @IsOptional()
  addressRegion?: string;

  @ApiPropertyOptional({ description: 'Country code', example: 'VN' })
  @IsString()
  @IsOptional()
  addressCountry?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '100000' })
  @IsString()
  @IsOptional()
  postalCode?: string;
}

export interface StationAddress {
  streetAddress?: string;
  addressLocality: string;
  addressRegion?: string;
  addressCountry?: string;
  postalCode?: string;
}

export class StationMetadataDto {
  @ApiPropertyOptional({
    description: 'Installation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsString()
  @IsOptional()
  installationDate?: string;

  @ApiPropertyOptional({
    description: 'Operator name',
    example: 'Hanoi Environmental Department',
  })
  @IsString()
  @IsOptional()
  operator?: string;

  @ApiPropertyOptional({
    description: 'Contact information',
    example: 'contact@example.com',
  })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional({
    description: 'Station description',
    example: 'Central monitoring station',
  })
  @IsString()
  @IsOptional()
  description?: string;

  [key: string]: any;
}

export interface StationMetadata {
  installationDate?: string;
  operator?: string;
  contact?: string;
  description?: string;
  [key: string]: any;
}

export enum StationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum StationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface ObservationStation {
  id: string;
  type: string;
  code: string;
  name: string;
  status: StationStatus;
  city?: string;
  district: string;
  ward?: string;
  location: StationLocation;
  address: StationAddress;
  timezone: string;
  timezoneOffset?: number;
  priority?: StationPriority;
  categories?: string[];
  metadata?: StationMetadata;
}

export interface StationDataSource {
  version: string;
  lastUpdated: string;
  stations: ObservationStation[];
}

/**
 * DTO for creating a new station
 */
export class CreateStationDto {
  @ApiProperty({
    description: 'Station name',
    example: 'Hanoi Central Station',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'City name', example: 'Hanoi' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ description: 'District name', example: 'Hoan Kiem' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiPropertyOptional({ description: 'Ward name', example: 'Hang Bo' })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiProperty({ description: 'Station location coordinates' })
  @ValidateNested()
  @Type(() => StationLocationDto)
  location: StationLocationDto;

  @ApiProperty({ description: 'Station address information' })
  @ValidateNested()
  @Type(() => StationAddressDto)
  address: StationAddressDto;

  @ApiPropertyOptional({ description: 'Timezone', example: 'Asia/Ho_Chi_Minh' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Station priority',
    enum: StationPriority,
    example: StationPriority.MEDIUM,
  })
  @IsEnum(StationPriority)
  @IsOptional()
  priority?: StationPriority;

  @ApiPropertyOptional({ description: 'Station categories', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: StationMetadata;
}

/**
 * DTO for updating a station
 */
export class UpdateStationDto {
  @ApiPropertyOptional({ description: 'Station name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Station status',
    enum: StationStatus,
  })
  @IsEnum(StationStatus)
  @IsOptional()
  status?: StationStatus;

  @ApiPropertyOptional({ description: 'City name' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'District name' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ description: 'Ward name' })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiPropertyOptional({ description: 'Station location coordinates' })
  @ValidateNested()
  @Type(() => StationLocationDto)
  @IsOptional()
  location?: StationLocationDto;

  @ApiPropertyOptional({ description: 'Station address information' })
  @ValidateNested()
  @Type(() => StationAddressDto)
  @IsOptional()
  address?: StationAddressDto;

  @ApiPropertyOptional({ description: 'Timezone' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Station priority',
    enum: StationPriority,
  })
  @IsEnum(StationPriority)
  @IsOptional()
  priority?: StationPriority;

  @ApiPropertyOptional({ description: 'Station categories', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @ValidateNested()
  @Type(() => StationMetadataDto)
  @IsOptional()
  metadata?: StationMetadataDto;
}

/**
 * DTO for station query parameters
 * Simplified: only filter by status with pagination
 */
export class StationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by station status',
    enum: StationStatus,
    example: StationStatus.ACTIVE,
  })
  @IsEnum(StationStatus)
  @IsOptional()
  status?: StationStatus;

  @ApiPropertyOptional({
    description: 'Maximum number of results',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    example: 0,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;
}

/**
 * DTO for station response
 */
export class StationResponseDto {
  id: string;
  name: string;
  code?: string;
  status: StationStatus;
  city?: string;
  district: string;
  location: StationLocation;
  address: StationAddress;
  priority?: StationPriority;
  categories?: string[];
  lastDataUpdate?: string;
}

/**
 * DTO for finding nearest station by GPS coordinates
 */
export class NearestStationQueryDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 21.028511,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 105.804817,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers',
    example: 50,
    minimum: 1,
    maximum: 500,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  @IsOptional()
  radius?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of stations to return',
    example: 1,
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  limit?: number;
}

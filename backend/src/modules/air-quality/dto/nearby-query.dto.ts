import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { NearbyIncludeType } from '@smart-forecast/shared';

/**
 * DTO for finding air quality by GPS coordinates (mobile)
 * Uses nearest station based on lat/lon
 */
export class NearbyQueryDto {
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
    description: 'Search radius in kilometers (default: 50km)',
    example: 50,
    minimum: 1,
    maximum: 500,
    default: 50,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  @IsOptional()
  radius?: number = 50;

  @ApiPropertyOptional({
    description: 'Type of data to include: current, forecast, or both',
    enum: NearbyIncludeType,
    default: NearbyIncludeType.CURRENT,
    example: 'current',
  })
  @IsEnum(NearbyIncludeType)
  @IsOptional()
  include?: NearbyIncludeType = NearbyIncludeType.CURRENT;
}

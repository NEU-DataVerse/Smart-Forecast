import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Query DTO for listing stations
 */
export class StationsQueryDto {
  @ApiProperty({
    description: 'Filter stations by city name',
    example: 'Hanoi',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;
}

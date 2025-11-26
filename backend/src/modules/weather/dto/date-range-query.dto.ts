import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DateRangeQueryDto {
  @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsString, ArrayMinSize, ArrayMaxSize } from 'class-validator';

/**
 * DTO for comparing air quality across multiple stations (admin dashboard)
 */
export class CompareQueryDto {
  @ApiProperty({
    description: 'Array of station codes to compare (comma-separated or array)',
    example: ['HN-HK-001', 'HN-HD-001', 'HN-CG-001'],
    type: [String],
    minItems: 2,
    maxItems: 10,
  })
  @Transform(({ value }) => {
    // Support both comma-separated string and array
    if (typeof value === 'string') {
      return value.split(',').map((s: string) => s.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2, {
    message: 'At least 2 stations are required for comparison',
  })
  @ArrayMaxSize(10, { message: 'Maximum 10 stations can be compared at once' })
  stationCodes: string[];
}

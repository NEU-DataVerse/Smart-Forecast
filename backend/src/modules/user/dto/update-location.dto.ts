import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 21.0285,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 105.8542,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude: number;
}

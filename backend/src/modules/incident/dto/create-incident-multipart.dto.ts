import { IsEnum, IsString, IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentType } from '@smart-forecast/shared';

/**
 * DTO for creating incident via multipart/form-data
 * Images are uploaded as files, location as separate longitude/latitude fields
 */
export class CreateIncidentMultipartDto {
  @ApiProperty({
    enum: IncidentType,
    example: IncidentType.FLOODING,
    description: 'Type of incident',
  })
  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @ApiProperty({
    example: 'Ngập nước nghiêm trọng tại đường Lê Duẩn',
    description: 'Detailed description of the incident',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '105.8342',
    description: 'Longitude coordinate',
  })
  @IsNumberString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty({
    example: '21.0278',
    description: 'Latitude coordinate',
  })
  @IsNumberString()
  @IsNotEmpty()
  latitude: string;
}

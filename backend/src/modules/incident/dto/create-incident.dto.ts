import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentType } from '@smart-forecast/shared';

class GeoPointDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  @IsNotEmpty()
  type: 'Point';

  @ApiProperty({
    example: [105.8342, 21.0278],
    description: 'Coordinates [longitude, latitude]',
  })
  @IsArray()
  @IsNotEmpty()
  coordinates: [number, number];
}

export class CreateIncidentDto {
  @ApiProperty({ enum: IncidentType, example: IncidentType.FLOODING })
  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @ApiProperty({ example: 'Ngập nước nghiêm trọng tại đường Lê Duẩn' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: GeoPointDto,
    example: {
      type: 'Point',
      coordinates: [105.8342, 21.0278],
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GeoPointDto)
  location: GeoPointDto;

  @ApiProperty({
    type: [String],
    example: ['http://localhost:9000/incidents/abc-123.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];
}

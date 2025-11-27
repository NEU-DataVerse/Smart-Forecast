import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertLevel, AlertType } from '@smart-forecast/shared';

export class CreateAlertDto {
  @ApiProperty({ enum: AlertLevel, example: AlertLevel.CRITICAL })
  @IsEnum(AlertLevel)
  @IsNotEmpty()
  level: AlertLevel;

  @ApiProperty({ enum: AlertType, example: AlertType.DISASTER })
  @IsEnum(AlertType)
  @IsNotEmpty()
  type: AlertType;

  @ApiProperty({ example: 'Cảnh báo ngập lụt khẩn cấp!' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Khu vực quận Hoàn Kiếm có nguy cơ ngập lụt cao. Người dân cần di chuyển đến nơi an toàn.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Affected geographic area (GeoJSON Polygon)',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [105.8, 21.0],
          [105.9, 21.0],
          [105.9, 21.1],
          [105.8, 21.1],
          [105.8, 21.0],
        ],
      ],
    },
  })
  @IsObject()
  @IsOptional()
  area?: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

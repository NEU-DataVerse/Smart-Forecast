import {
  IsEnum,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  AlertLevel,
  AlertType,
  AlertMetric,
  ThresholdOperator,
} from '@smart-forecast/shared';

export class UpdateAlertThresholdDto {
  @ApiPropertyOptional({
    enum: AlertType,
    example: AlertType.AIR_QUALITY,
  })
  @IsEnum(AlertType)
  @IsOptional()
  type?: AlertType;

  @ApiPropertyOptional({
    enum: AlertMetric,
    example: AlertMetric.AQI,
  })
  @IsEnum(AlertMetric)
  @IsOptional()
  metric?: AlertMetric;

  @ApiPropertyOptional({
    enum: ThresholdOperator,
    example: ThresholdOperator.GT,
  })
  @IsEnum(ThresholdOperator)
  @IsOptional()
  operator?: ThresholdOperator;

  @ApiPropertyOptional({
    example: 150,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @ApiPropertyOptional({
    enum: AlertLevel,
    example: AlertLevel.HIGH,
  })
  @IsEnum(AlertLevel)
  @IsOptional()
  level?: AlertLevel;

  @ApiPropertyOptional({
    example: 'Chất lượng không khí ở mức kém.',
  })
  @IsString()
  @IsOptional()
  adviceTemplate?: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

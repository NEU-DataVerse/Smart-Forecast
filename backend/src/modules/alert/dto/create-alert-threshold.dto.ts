import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AlertLevel,
  AlertType,
  AlertMetric,
  ThresholdOperator,
} from '@smart-forecast/shared';

export class CreateAlertThresholdDto {
  @ApiProperty({
    enum: AlertType,
    example: AlertType.AIR_QUALITY,
    description: 'Type of alert this threshold applies to',
  })
  @IsEnum(AlertType)
  @IsNotEmpty()
  type: AlertType;

  @ApiProperty({
    enum: AlertMetric,
    example: AlertMetric.AQI,
    description: 'The metric to monitor',
  })
  @IsEnum(AlertMetric)
  @IsNotEmpty()
  metric: AlertMetric;

  @ApiProperty({
    enum: ThresholdOperator,
    example: ThresholdOperator.GT,
    description: 'Comparison operator',
  })
  @IsEnum(ThresholdOperator)
  @IsNotEmpty()
  operator: ThresholdOperator;

  @ApiProperty({
    example: 150,
    description: 'Threshold value',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    enum: AlertLevel,
    example: AlertLevel.HIGH,
    description: 'Alert level when threshold is exceeded',
  })
  @IsEnum(AlertLevel)
  @IsNotEmpty()
  level: AlertLevel;

  @ApiProperty({
    example:
      'Chất lượng không khí ở mức kém. Hạn chế hoạt động ngoài trời, đeo khẩu trang N95 khi ra ngoài.',
    description: 'Advice template to include in alert',
  })
  @IsString()
  @IsNotEmpty()
  adviceTemplate: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether this threshold is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentStatus } from '@smart-forecast/shared';

export class UpdateIncidentStatusDto {
  @ApiProperty({ enum: IncidentStatus, example: IncidentStatus.VERIFIED })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiProperty({ required: false, example: 'Đã xác minh và đang xử lý' })
  @IsString()
  @IsOptional()
  notes?: string;
}

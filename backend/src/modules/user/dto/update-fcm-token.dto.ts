import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFcmTokenDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID (optional, for testing without authentication)',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    example: 'dGhpcyBpcyBhIGZha2UgZmNtIHRva2VuIGZvciBkZW1vIHB1cnBvc2Vz',
    description: 'Firebase Cloud Messaging token for push notifications',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IGoogleAuthRequest } from '@smart-forecast/shared';

export class GoogleAuthDto implements IGoogleAuthRequest {
  @ApiProperty({
    description: 'Google ID Token from mobile app',
    example:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0NTBhMzVhMjA4MWZhYTFkOWFlMjE5MjRhMjdhZDc5MGJkODAiLCJ0eXAiOiJKV1QifQ...',
  })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

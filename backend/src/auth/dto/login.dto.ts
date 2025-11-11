import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ILoginRequest } from '@smart-forecast/shared';

export class LoginDto implements ILoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

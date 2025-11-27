import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole, ICreateUser } from '@smart-forecast/shared';

export class CreateUserDto implements ICreateUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserRole, {
    message: 'Role must be a valid UserRole',
  })
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsOptional()
  emailVerified?: boolean;
}

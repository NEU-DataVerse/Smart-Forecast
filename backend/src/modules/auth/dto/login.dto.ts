/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

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

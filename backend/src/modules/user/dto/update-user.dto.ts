/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

import { IsOptional, IsString } from 'class-validator';
import { IUpdateUser } from '@smart-forecast/shared';

export class UpdateUserDto implements IUpdateUser {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  fcmToken?: string;
}

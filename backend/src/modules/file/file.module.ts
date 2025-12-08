/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}

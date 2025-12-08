/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

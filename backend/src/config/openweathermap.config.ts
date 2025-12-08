/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

import { registerAs } from '@nestjs/config';

export default registerAs('openweathermap', () => ({
  apiKey: process.env.OPENWEATHERMAP_API_KEY || '',
}));

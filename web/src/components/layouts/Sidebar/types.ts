/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
}

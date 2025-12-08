/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

/**
 * Query-related types shared across modules
 */

/**
 * Enum for specifying which data to include in nearby/GPS-based responses
 * Used by both air-quality and weather modules for mobile APIs
 */
export enum NearbyIncludeType {
  CURRENT = 'current',
  FORECAST = 'forecast',
  BOTH = 'both',
}

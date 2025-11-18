/**
 * DTO for ingestion status response
 */
export class IngestionStatusDto {
  message: string;
  success: number;
  failed: number;
  errors?: Array<{
    location: string;
    error: string;
  }>;
}

/**
 * DTO for full ingestion response
 */
export class FullIngestionStatusDto {
  message: string;
  airQuality: {
    success: number;
    failed: number;
    errors: Array<{
      location: string;
      error: string;
    }>;
  };
  weather: {
    success: number;
    failed: number;
    errors: Array<{
      location: string;
      error: string;
    }>;
  };
}

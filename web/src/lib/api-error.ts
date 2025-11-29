/**
 * API Error Handler
 * Centralized error handling with friendly messages
 */

interface AxiosErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string | string[];
    };
  };
  request?: unknown;
  message?: string;
}

function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'request' in error || 'message' in error)
  );
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

export class ApiErrorHandler {
  static parseError(error: unknown): ApiError {
    if (!isAxiosError(error)) {
      return {
        message: 'An unexpected error occurred.',
      };
    }

    // Handle axios error response
    if (error.response) {
      const { status, data } = error.response;

      // Backend error messages
      if (data?.message) {
        return {
          message: Array.isArray(data.message) ? data.message.join(', ') : data.message,
          statusCode: status,
          details: data,
        };
      }

      // Status code specific messages
      switch (status) {
        case 400:
          return {
            message: 'Invalid request. Please check your input.',
            statusCode: status,
          };
        case 401:
          return {
            message: 'Unauthorized. Please login again.',
            statusCode: status,
          };
        case 403:
          return {
            message: 'You do not have permission to perform this action.',
            statusCode: status,
          };
        case 404:
          return {
            message: 'Resource not found.',
            statusCode: status,
          };
        case 500:
          return {
            message: 'Server error. Please try again later.',
            statusCode: status,
          };
        default:
          return {
            message: `Request failed with status ${status}`,
            statusCode: status,
          };
      }
    }

    // Handle network errors
    if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      };
    }

    // Handle other errors
    return {
      message: error.message || 'An unexpected error occurred.',
    };
  }

  static shouldShowToast(error: ApiError): boolean {
    // Don't show toast for 401 (handled by interceptor redirect)
    if (error.statusCode === 401) {
      return false;
    }
    return true;
  }
}

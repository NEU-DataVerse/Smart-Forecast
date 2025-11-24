/**
 * API Client
 * Wrapper around axios with error handling and toast notifications
 */

import { userAxios } from '@/services/axios';
import { toast } from 'sonner';
import { ApiErrorHandler } from './api-error';
import { AxiosRequestConfig } from 'axios';

/**
 * Generic GET request
 */
export async function apiGet<T>(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await userAxios.get<T>(url, {
      params,
      ...config,
    });
    return response.data;
  } catch (error) {
    const apiError = ApiErrorHandler.parseError(error);
    if (ApiErrorHandler.shouldShowToast(apiError)) {
      toast.error(apiError.message);
    }
    throw apiError;
  }
}

/**
 * Generic POST request
 */
export async function apiPost<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  showSuccessToast = false,
  successMessage = 'Operation completed successfully',
): Promise<T> {
  try {
    const response = await userAxios.post<T>(url, data, config);
    if (showSuccessToast) {
      toast.success(successMessage);
    }
    return response.data;
  } catch (error) {
    const apiError = ApiErrorHandler.parseError(error);
    if (ApiErrorHandler.shouldShowToast(apiError)) {
      toast.error(apiError.message);
    }
    throw apiError;
  }
}

/**
 * Generic PUT request
 */
export async function apiPut<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  showSuccessToast = true,
  successMessage = 'Updated successfully',
): Promise<T> {
  try {
    const response = await userAxios.put<T>(url, data, config);
    if (showSuccessToast) {
      toast.success(successMessage);
    }
    return response.data;
  } catch (error) {
    const apiError = ApiErrorHandler.parseError(error);
    if (ApiErrorHandler.shouldShowToast(apiError)) {
      toast.error(apiError.message);
    }
    throw apiError;
  }
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
  showSuccessToast = true,
  successMessage = 'Deleted successfully',
): Promise<T> {
  try {
    const response = await userAxios.delete<T>(url, config);
    if (showSuccessToast) {
      toast.success(successMessage);
    }
    return response.data;
  } catch (error) {
    const apiError = ApiErrorHandler.parseError(error);
    if (ApiErrorHandler.shouldShowToast(apiError)) {
      toast.error(apiError.message);
    }
    throw apiError;
  }
}

/**
 * Generic PATCH request
 */
export async function apiPatch<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  showSuccessToast = true,
  successMessage = 'Updated successfully',
): Promise<T> {
  try {
    const response = await userAxios.patch<T>(url, data, config);
    if (showSuccessToast) {
      toast.success(successMessage);
    }
    return response.data;
  } catch (error) {
    const apiError = ApiErrorHandler.parseError(error);
    if (ApiErrorHandler.shouldShowToast(apiError)) {
      toast.error(apiError.message);
    }
    throw apiError;
  }
}

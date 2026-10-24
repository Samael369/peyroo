// ==============================================================================
// Peyroo Shared Types and API Contracts
// ==============================================================================

/**
 * Standard API Success Response Envelope
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Standard API Error Detail
 */
export interface ApiErrorDetail {
  field?: string;
  message: string;
}

/**
 * Standard API Error Response Envelope
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[] | unknown;
  };
}

/**
 * Common API Response Union
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Minimal Health Check Response Contract
 */
export interface HealthCheckData {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
}

export type HealthCheckResponse = ApiSuccessResponse<HealthCheckData>;

/**
 * Preliminary Domain Enums (Contracts)
 */
export type UserRole = 'MENTEE' | 'MENTOR' | 'ADMIN';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

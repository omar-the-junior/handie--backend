import type { ValidationErrorResponseBody } from '../middleware/validation.middleware.js';

// Base response type
export interface BaseResponse {
  status: 'success' | 'error';
  message?: string;
}

// Success response type with data
export interface SuccessResponse<Data> extends BaseResponse {
  status: 'success';
  data: Data;
}

// Authentication error response type
export interface AuthenticationErrorResponse extends BaseResponse {
  status: 'error';
  error: string;
  errorCode: 'AUTHENTICATION_ERROR';
}

// Authorization error response type
export interface AuthorizationErrorResponse extends BaseResponse {
  status: 'error';
  error: string;
  errorCode: 'AUTHORIZATION_ERROR';
}

// Not Found error response type
export interface NotFoundErrorResponse extends BaseResponse {
  status: 'error';
  error: string;
  errorCode: 'NOT_FOUND_ERROR';
}

export interface InsufficientStockErrorResponse extends BaseResponse {
  status: 'error';
  error: string;
  errorCode: 'INSUFFICIENT_STOCK_ERROR';
}

// Define a type for all possible responses
export type ApiResponse<T> =
  | SuccessResponse<T>
  | AuthenticationErrorResponse
  | AuthorizationErrorResponse
  | NotFoundErrorResponse
  | InsufficientStockErrorResponse
  | ValidationErrorResponseBody;

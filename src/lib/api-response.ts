/**
 * Standardized API response utilities.
 *
 * Provides consistent error and success response formats across all API routes.
 * All errors are structured as `{ error: { code, message, details? } }`.
 *
 * @example
 * ```ts
 * import { apiError, apiSuccess } from '@/lib/api-response';
 * return apiError('VALIDATION_ERROR', 'Invalid input', { field: 'email' });
 * return apiSuccess({ user: { id: '123' } });
 * ```
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createLogger } from "./logger";

const apiLogger = createLogger({ module: "api" });

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
}

/**
 * Creates a standardized error response.
 *
 * @param code - Machine-readable error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
 * @param message - Human-readable error message
 * @param httpStatus - HTTP status code (default: 500)
 * @param details - Optional additional error details
 * @returns NextResponse with standardized error format
 */
export function apiError(
  code: string,
  message: string,
  httpStatus = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  apiLogger.warn({ code, httpStatus, details }, `API Error: ${message}`);

  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status: httpStatus }
  );
}

/**
 * Creates a standardized success response.
 *
 * @param data - Response payload
 * @param httpStatus - HTTP status code (default: 200)
 * @returns NextResponse with standardized success format
 */
export function apiSuccess<T = unknown>(
  data: T,
  httpStatus = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data }, { status: httpStatus });
}

/**
 * Handles Zod validation errors by converting them to a 400 API response.
 *
 * @param error - ZodError instance
 * @returns NextResponse with validation error details
 */
export function handleZodError(error: ZodError): NextResponse<ApiErrorResponse> {
  const details = error.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));

  return apiError("VALIDATION_ERROR", "Invalid request input", 400, details);
}

/**
 * Wraps an async API handler with error handling.
 * Catches unexpected errors and returns a standardized 500 response.
 *
 * @param handler - Async function that handles the request
 * @returns Promise resolving to a NextResponse
 */
export function withErrorHandling<T>(
  handler: () => Promise<NextResponse<T | ApiErrorResponse>>
): Promise<NextResponse<T | ApiErrorResponse>> {
  return handler().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : "Internal server error";
    apiLogger.error({ err }, "Unhandled API error");
    return apiError("INTERNAL_ERROR", message, 500);
  });
}

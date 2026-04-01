/**
 * Centralized logger using pino for structured JSON logging.
 *
 * In production, outputs structured JSON suitable for log aggregation.
 * In development, uses pino-pretty for human-readable colored output.
 *
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 * logger.info({ userId: '123' }, 'User signed up');
 * logger.error({ err: error, route: '/api/signup' }, 'Signup failed');
 * ```
 */

import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }),
  base: {
    service: "pantero-waitlist",
  },
});

/**
 * Creates a child logger with additional context fields.
 *
 * @param context - Additional fields to include in every log entry
 * @returns A child pino logger instance
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

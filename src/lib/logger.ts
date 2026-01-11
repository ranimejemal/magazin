/**
 * Secure logger utility that sanitizes error objects before logging
 * In production, sensitive details are stripped from console output
 */

const isDev = import.meta.env.DEV;

interface SanitizedError {
  message: string;
  code?: string;
}

/**
 * Sanitizes an error object to remove sensitive database/system details
 */
function sanitizeError(error: unknown): SanitizedError {
  if (error instanceof Error) {
    return {
      message: isDev ? error.message : 'An error occurred',
      code: (error as any).code,
    };
  }
  
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: isDev ? String(err.message || 'Unknown error') : 'An error occurred',
      code: typeof err.code === 'string' ? err.code : undefined,
    };
  }
  
  return { message: isDev ? String(error) : 'An error occurred' };
}

/**
 * Logs errors safely - verbose in development, sanitized in production
 */
export function logError(context: string, error: unknown): void {
  if (isDev) {
    // In development, log the full error for debugging
    console.error(`[${context}]`, error);
  } else {
    // In production, log sanitized error info only
    const sanitized = sanitizeError(error);
    console.error(`[${context}]`, sanitized.message, sanitized.code ? `(${sanitized.code})` : '');
  }
}

/**
 * Logs warnings safely
 */
export function logWarning(context: string, message: string): void {
  if (isDev) {
    console.warn(`[${context}]`, message);
  }
}

/**
 * Logs info messages (only in development)
 */
export function logInfo(context: string, message: string): void {
  if (isDev) {
    console.info(`[${context}]`, message);
  }
}

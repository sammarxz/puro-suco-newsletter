import { AppError } from './AppError'

export interface ErrorResponse {
  success: false
  message: string
  statusCode: number
  errors?: unknown[]
  context?: Record<string, unknown>
}

export class ErrorHandler {
  static handleError(error: unknown): { status: number; body: ErrorResponse } {
    if (error instanceof AppError) {
      return {
        status: error.statusCode,
        body: {
          success: false,
          message: error.message,
          statusCode: error.statusCode,
          errors: 'validationErrors' in error ? error.validationErrors : undefined,
          context: error.context,
        },
      }
    }

    console.error('Unexpected error:', error)

    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
        statusCode: 500,
      },
    }
  }

  static logError(error: unknown, context?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString()
    const errorInfo = {
      timestamp,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      context,
    }

    console.error('[ERROR]', JSON.stringify(errorInfo, null, 2))
  }

  static async handleAsyncError<T>(
    operation: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      this.logError(error, context)
      throw error
    }
  }
}

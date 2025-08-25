export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors?: unknown[]
  ) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class DuplicateError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} already exists`, 409, 'DUPLICATE_ERROR')
    this.name = 'DuplicateError'
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'External service error') {
    super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR')
    this.name = 'ExternalServiceError'
  }
}

export function handleApiError(error: unknown): { status: number; body: unknown } {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        message: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { errors: error.errors }),
      },
    }
  }

  // Unknown error
  return {
    status: 500,
    body: {
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  }
}

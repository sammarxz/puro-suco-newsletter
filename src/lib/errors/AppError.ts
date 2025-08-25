export abstract class AppError extends Error {
  abstract readonly statusCode: number
  abstract readonly isOperational: boolean

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 400
  readonly isOperational = true

  constructor(
    message: string,
    public readonly validationErrors?: unknown[],
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404
  readonly isOperational = true
}

export class RateLimitError extends AppError {
  readonly statusCode = 429
  readonly isOperational = true

  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

export class EmailDeliveryError extends AppError {
  readonly statusCode = 500
  readonly isOperational = true

  constructor(
    message: string = 'Failed to send email',
    public readonly emailProvider?: string,
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

export class DatabaseConnectionError extends AppError {
  readonly statusCode = 500
  readonly isOperational = true

  constructor(
    message: string = 'Database connection failed',
    public readonly provider?: string,
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

export class TemplateRenderError extends AppError {
  readonly statusCode = 500
  readonly isOperational = true

  constructor(
    message: string = 'Failed to render email template',
    public readonly templateName?: string,
    context?: Record<string, unknown>
  ) {
    super(message, context)
  }
}

export class AuthenticationError extends AppError {
  readonly statusCode = 401
  readonly isOperational = true
}

export class AuthorizationError extends AppError {
  readonly statusCode = 403
  readonly isOperational = true
}

export class ConflictError extends AppError {
  readonly statusCode = 409
  readonly isOperational = true
}

export class InternalServerError extends AppError {
  readonly statusCode = 500
  readonly isOperational = false

  constructor(message: string = 'Internal server error', context?: Record<string, unknown>) {
    super(message, context)
  }
}

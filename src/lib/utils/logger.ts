interface LogContext {
  [key: string]: unknown
}

export class Logger {
  private static formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  static info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context))
  }

  static warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  static error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? {
          ...context,
          error: error.message,
          stack: error.stack,
        }
      : context
    console.error(this.formatMessage('error', message, errorContext))
  }

  static debug(message: string, context?: LogContext): void {
    if (import.meta.env.DEV) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }
}

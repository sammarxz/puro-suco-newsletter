import { describe, it, expect, vi } from 'vitest'
import { ErrorHandler } from '../ErrorHandler'
import { ValidationError, NotFoundError, InternalServerError } from '../AppError'

describe('ErrorHandler', () => {
  describe('handleError', () => {
    it('should handle ValidationError correctly', () => {
      const error = new ValidationError('Invalid input', [{ field: 'email', message: 'Required' }])
      const result = ErrorHandler.handleError(error)

      expect(result.status).toBe(400)
      expect(result.body).toEqual({
        success: false,
        message: 'Invalid input',
        statusCode: 400,
        errors: [{ field: 'email', message: 'Required' }],
        context: undefined,
      })
    })

    it('should handle NotFoundError correctly', () => {
      const error = new NotFoundError('Resource not found')
      const result = ErrorHandler.handleError(error)

      expect(result.status).toBe(404)
      expect(result.body).toEqual({
        success: false,
        message: 'Resource not found',
        statusCode: 404,
        errors: undefined,
        context: undefined,
      })
    })

    it('should handle unexpected errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Unexpected error')

      const result = ErrorHandler.handleError(error)

      expect(result.status).toBe(500)
      expect(result.body).toEqual({
        success: false,
        message: 'Internal server error',
        statusCode: 500,
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error:', error)

      consoleErrorSpy.mockRestore()
    })

    it('should include context in error response', () => {
      const context = { userId: '123', action: 'subscribe' }
      const error = new InternalServerError('Server error', context)

      const result = ErrorHandler.handleError(error)

      expect(result.body.context).toEqual(context)
    })
  })

  describe('logError', () => {
    it('should log error with context', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Test error')
      const context = { endpoint: '/test' }

      ErrorHandler.logError(error, context)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR]',
        expect.stringContaining('"name": "Error"')
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR]',
        expect.stringContaining('"message": "Test error"')
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR]',
        expect.stringContaining('"endpoint": "/test"')
      )

      consoleErrorSpy.mockRestore()
    })

    it('should handle non-Error objects', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = 'String error'

      ErrorHandler.logError(error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR]',
        expect.stringContaining('"error": "String error"')
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('handleAsyncError', () => {
    it('should execute operation successfully', async () => {
      const operation = vi.fn().mockResolvedValue('success')

      const result = await ErrorHandler.handleAsyncError(operation)

      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledOnce()
    })

    it('should log and re-throw errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Async error')
      const operation = vi.fn().mockRejectedValue(error)
      const context = { operation: 'test' }

      await expect(ErrorHandler.handleAsyncError(operation, context)).rejects.toThrow('Async error')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})

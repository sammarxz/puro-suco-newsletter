import type { APIRoute } from 'astro'
import { z } from 'zod'
import { container, TOKENS } from '../../lib/container/bindings'
import { SubscriptionUseCase } from '../../domain/usecases/SubscriptionUseCase'
import { ValidationError } from '../../lib/errors/AppError'
import { ErrorHandler } from '../../lib/errors/ErrorHandler'
import { SecurityHeadersBuilder } from '../../lib/middleware/SecurityHeaders'

const subscriptionSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const POST: APIRoute = async ({ request, url }) => {
  return ErrorHandler.handleAsyncError(
    async () => {
      const formData = await request.formData()
      const body = {
        email: formData.get('email') as string,
      }

      const validationResult = subscriptionSchema.safeParse(body)
      if (!validationResult.success) {
        throw new ValidationError('Email inválido', validationResult.error.errors)
      }

      const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
        TOKENS.SUBSCRIPTION_USE_CASE
      )

      const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
      const result = await subscriptionUseCase.subscribe(validationResult.data.email, baseUrl)

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: SecurityHeadersBuilder.api(),
      })
    },
    { endpoint: '/api/subscribe', method: 'POST' }
  ).catch(error => {
    const { status, body } = ErrorHandler.handleError(error)
    return new Response(JSON.stringify(body), {
      status,
      headers: SecurityHeadersBuilder.api(),
    })
  })
}

export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 200,
    headers: new SecurityHeadersBuilder()
      .withContentType('application/json')
      .withCORS('*', 'POST, OPTIONS', 'Content-Type')
      .build(),
  })
}

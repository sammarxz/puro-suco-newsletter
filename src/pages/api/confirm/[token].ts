import type { APIRoute } from 'astro'
import { z } from 'zod'
import { container, TOKENS } from '../../../lib/container/bindings'
import { SubscriptionUseCase } from '../../../domain/usecases/SubscriptionUseCase'

const paramsSchema = z.object({
  token: z.string().min(1),
})

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const { token } = paramsSchema.parse(params)

    const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
      TOKENS.SUBSCRIPTION_USE_CASE
    )

    const baseUrl = url.origin

    const confirmationResult = await subscriptionUseCase.confirmSubscription(token, baseUrl)

    if (!confirmationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: confirmationResult.message || 'Token inválido',
          statusCode: 400,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: confirmationResult.message || 'Email confirmado com sucesso!',
        statusCode: 200,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Confirmation error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno na confirmação', statusCode: 500 }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

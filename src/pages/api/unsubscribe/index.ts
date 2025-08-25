import type { APIRoute } from 'astro'
import { z } from 'zod'
import { container, TOKENS } from '../../../lib/container/bindings'
import { SubscriptionUseCase } from '../../../domain/usecases/SubscriptionUseCase'

const querySchema = z.object({
  email: z.string().email(),
  token: z.string().min(1).optional(),
})

export const GET: APIRoute = async ({ url }) => {
  try {
    const params = Object.fromEntries(url.searchParams.entries())
    const { email, token } = querySchema.parse(params)

    const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
      TOKENS.SUBSCRIPTION_USE_CASE
    )

    const result = await subscriptionUseCase.unsubscribe(email, token)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.message || 'Requisição inválida',
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
        message: result.message || 'Inscrição cancelada com sucesso!',
        statusCode: 200,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Erro interno ao cancelar inscrição',
        statusCode: 500,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

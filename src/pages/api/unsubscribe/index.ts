import type { APIRoute } from 'astro'
import { z } from 'zod'
import { container, TOKENS } from '../../../lib/container/bindings'
import { SubscriptionUseCase } from '../../../domain/usecases/SubscriptionUseCase'

const querySchema = z.object({
  email: z.string().email(),
  token: z.string().min(1).optional(),
})

export const GET: APIRoute = async ({ url, redirect }) => {
  try {
    const params = Object.fromEntries(url.searchParams.entries())
    const { email, token } = querySchema.parse(params)

    const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
      TOKENS.SUBSCRIPTION_USE_CASE
    )

    const result = await subscriptionUseCase.unsubscribe(email, token)

    if (!result.success) {
      const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
      return redirect(`${baseUrl}/unsubscribe?error=invalid-request`)
    }

    const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
    return redirect(`${baseUrl}/unsubscribe?success=true`)
  } catch (error) {
    console.error('Unsubscribe error:', error)
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
    return redirect(`${baseUrl}/unsubscribe?error=unsubscribe-failed`)
  }
}

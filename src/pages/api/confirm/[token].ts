import type { APIRoute } from 'astro'
import { z } from 'zod'
import { container, TOKENS } from '../../../lib/container/bindings'
import { SubscriptionUseCase } from '../../../domain/usecases/SubscriptionUseCase'

const paramsSchema = z.object({
  token: z.string().min(1),
})

export const GET: APIRoute = async ({ params, url, redirect }) => {
  try {
    const { token } = paramsSchema.parse(params)

    const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
      TOKENS.SUBSCRIPTION_USE_CASE
    )

    const confirmationResult = await subscriptionUseCase.confirmSubscription(token)

    if (!confirmationResult.success) {
      const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
      return redirect(`${baseUrl}?error=invalid-token`)
    }

    const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
    return redirect(`${baseUrl}?confirmed=true`)
  } catch (error) {
    console.error('Confirmation error:', error)
    const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
    return redirect(`${baseUrl}?error=confirmation-failed`)
  }
}

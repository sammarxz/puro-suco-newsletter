import { container, TOKENS } from '../container/bindings'
import { SubscriptionUseCase } from '../../domain/usecases/SubscriptionUseCase'
import type { SubscriptionInput, UnsubscribeInput } from '../validations/subscription'

export class SubscriptionService {
  async subscribe(input: SubscriptionInput) {
    const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
      TOKENS.SUBSCRIPTION_USE_CASE
    )

    const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:3000'
    const result = await subscriptionUseCase.subscribe(input.email, baseUrl)

    return result
  }

  async unsubscribe(input: UnsubscribeInput) {
    const subscriptionUseCase = await container.resolve<SubscriptionUseCase>(
      TOKENS.SUBSCRIPTION_USE_CASE
    )

    // Pass empty string as email and token as second parameter
    return await subscriptionUseCase.unsubscribe('', input.token)
  }
}

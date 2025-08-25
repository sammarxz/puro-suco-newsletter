import { SubscriptionUseCase } from '../../domain/usecases/SubscriptionUseCase'
import { InMemorySubscriberRepository } from '../../infrastructure/storage/InMemorySubscriberRepository'
import { ResendEmailService } from '../../infrastructure/email/ResendEmailService'
import type { SubscriptionInput, UnsubscribeInput } from '../validations/subscription'

export class SubscriptionService {
  private subscriptionUseCase: SubscriptionUseCase
  private emailService: ResendEmailService

  constructor() {
    const subscriberRepository = new InMemorySubscriberRepository()
    this.subscriptionUseCase = new SubscriptionUseCase(subscriberRepository)
    this.emailService = new ResendEmailService(import.meta.env.RESEND_API_KEY)
  }

  async subscribe(input: SubscriptionInput) {
    const result = await this.subscriptionUseCase.subscribe(input.email)

    if (result.success && result.subscriber) {
      const unsubscribeUrl = `${import.meta.env.PUBLIC_SITE_URL}/unsubscribe/${result.subscriber.unsubscribeToken}`
      await this.emailService.sendWelcomeEmail(result.subscriber.email, unsubscribeUrl)
    }

    return result
  }

  async unsubscribe(input: UnsubscribeInput) {
    return await this.subscriptionUseCase.unsubscribe(input.token)
  }
}

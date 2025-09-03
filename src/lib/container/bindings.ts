import { DIContainer } from './DIContainer'
import { TursoSubscriberRepository } from '../../infrastructure/repositories/TursoSubscriberRepository'
import { ResendEmailService } from '../../infrastructure/email/ResendEmailService'
import { SubscriptionUseCase } from '../../domain/usecases/SubscriptionUseCase'
import { NewsletterSendingUseCase } from '../../domain/usecases/NewsletterSendingUseCase'
import { AstroNewsletterRepository } from '../../infrastructure/repositories/AstroNewsletterRepository'
import type { SubscriberRepository } from '../../domain/repositories/SubscriberRepository'
import type { NewsletterRepository } from '../../domain/repositories/NewsletterRepository'
import type { EmailService } from '../../domain/services/EmailService'

const TOKENS = {
  SUBSCRIBER_REPOSITORY: 'SubscriberRepository',
  NEWSLETTER_REPOSITORY: 'NewsletterRepository',
  EMAIL_SERVICE: 'EmailService',
  SUBSCRIPTION_USE_CASE: 'SubscriptionUseCase',
  NEWSLETTER_SENDING_USE_CASE: 'NewsletterSendingUseCase',
} as const

export { TOKENS }

export function configureContainer(): DIContainer {
  const container = new DIContainer()

  container.register(TOKENS.SUBSCRIBER_REPOSITORY, () => new TursoSubscriberRepository())

  container.register(TOKENS.NEWSLETTER_REPOSITORY, () => new AstroNewsletterRepository())

  container.register(TOKENS.EMAIL_SERVICE, () => {
    const apiKey = import.meta.env?.RESEND_API_KEY || process.env.RESEND_API_KEY
    const fromEmail = import.meta.env?.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required')
    }

    return new ResendEmailService(apiKey, fromEmail || 'Puro Suco <onboarding@resend.dev>')
  })

  container.register(TOKENS.SUBSCRIPTION_USE_CASE, async () => {
    const subscriberRepository = (await container.resolve(
      TOKENS.SUBSCRIBER_REPOSITORY
    )) as SubscriberRepository
    const emailService = (await container.resolve(TOKENS.EMAIL_SERVICE)) as EmailService
    return new SubscriptionUseCase(subscriberRepository, emailService)
  })

  container.register(TOKENS.NEWSLETTER_SENDING_USE_CASE, async () => {
    const subscriberRepository = (await container.resolve(
      TOKENS.SUBSCRIBER_REPOSITORY
    )) as SubscriberRepository
    const newsletterRepository = (await container.resolve(
      TOKENS.NEWSLETTER_REPOSITORY
    )) as NewsletterRepository
    const emailService = (await container.resolve(TOKENS.EMAIL_SERVICE)) as EmailService
    return new NewsletterSendingUseCase(subscriberRepository, newsletterRepository, emailService)
  })

  return container
}

const globalContainer = configureContainer()

export { globalContainer as container }

import type { SubscriberRepository } from '../repositories/SubscriberRepository'
import type { NewsletterRepository } from '../repositories/NewsletterRepository'
import { NewsletterIssue } from '../entities/NewsletterIssue'
import type { EmailService } from '../services/EmailService'

export interface NewsletterSendingResult {
  success: boolean
  message: string
  sentCount?: number
  failedCount?: number
}

/**
 * Use Case para envio de newsletters
 * Implementa a lógica de negócio para enviar newsletters para subscribers ativos
 */
export class NewsletterSendingUseCase {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private newsletterRepository: NewsletterRepository,
    private emailService: EmailService
  ) {}

  /**
   * Envia uma newsletter específica para todos os subscribers ativos
   */
  async sendNewsletterBySlug(slug: string): Promise<NewsletterSendingResult> {
    try {
      const newsletter = await this.newsletterRepository.findBySlug(slug)
      if (!newsletter) {
        return {
          success: false,
          message: 'Newsletter não encontrada',
        }
      }

      if (!newsletter.isPublished()) {
        return {
          success: false,
          message: 'Newsletter ainda não foi publicada',
        }
      }

      return await this.sendNewsletterToAll(newsletter)
    } catch (_error) {
      return {
        success: false,
        message: 'Erro interno ao enviar newsletter',
      }
    }
  }

  /**
   * Envia uma newsletter específica para todos os subscribers ativos
   */
  async sendToAllSubscribers(
    newsletter: NewsletterIssue,
    baseUrl: string
  ): Promise<NewsletterSendingResult> {
    try {
      return await this.sendNewsletterToAll(newsletter, baseUrl)
    } catch (_error) {
      return {
        success: false,
        message: 'Erro interno ao enviar newsletter',
      }
    }
  }

  /**
   * Envia a newsletter mais recente para todos os subscribers ativos
   */
  async sendLatestNewsletter(): Promise<NewsletterSendingResult> {
    try {
      const newsletter = await this.newsletterRepository.findLatest()
      if (!newsletter) {
        return {
          success: false,
          message: 'Nenhuma newsletter encontrada',
        }
      }

      if (!newsletter.isPublished()) {
        return {
          success: false,
          message: 'Newsletter mais recente ainda não foi publicada',
        }
      }

      return await this.sendNewsletterToAll(newsletter)
    } catch (_error) {
      return {
        success: false,
        message: 'Erro interno ao enviar newsletter',
      }
    }
  }

  /**
   * Lógica principal de envio de newsletter
   */
  private async sendNewsletterToAll(
    newsletter: NewsletterIssue,
    baseUrl?: string
  ): Promise<NewsletterSendingResult> {
    const activeSubscribers = await this.subscriberRepository.findAllActive()

    if (activeSubscribers.length === 0) {
      return {
        success: false,
        message: 'Nenhum subscriber ativo encontrado',
        sentCount: 0,
      }
    }

    const emailData = newsletter.toEmailData()
    let sentCount = 0
    let failedCount = 0

    // Envio individual para permitir URLs de unsubscribe personalizadas
    const finalBaseUrl = baseUrl || process.env.PUBLIC_SITE_URL || 'http://localhost:3000'

    for (const subscriber of activeSubscribers) {
      try {
        const unsubscribeUrl = `${finalBaseUrl}/unsubscribe/${subscriber.getUnsubscribeToken()}`

        await this.emailService.sendNewsletter([subscriber.getEmail()], emailData, unsubscribeUrl)

        sentCount++
      } catch (error) {
        failedCount++
        console.error('Falha ao enviar email para:', subscriber.getEmail(), error)
      }

      // Pequena pausa entre emails para respeitar rate limits
      await this.sleep(100)
    }

    const success = sentCount > 0
    const message = success
      ? `Newsletter enviada com sucesso! ${sentCount} emails enviados`
      : 'Falha ao enviar newsletter'

    if (failedCount > 0) {
      return {
        success,
        message: `${message}. ${failedCount} emails falharam.`,
        sentCount,
        failedCount,
      }
    }

    return {
      success,
      message,
      sentCount,
      failedCount,
    }
  }

  /**
   * Envia email de confirmação para subscriber pendente
   */
  async sendConfirmationEmail(subscriberEmail: string): Promise<boolean> {
    try {
      const subscriber = await this.subscriberRepository.findByEmail(subscriberEmail)

      if (!subscriber || !subscriber.isPending()) {
        return false
      }

      const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000'
      const confirmationUrl = `${baseUrl}/confirm/${subscriber.getUnsubscribeToken()}`

      await this.emailService.sendConfirmationEmail(subscriber.getEmail(), confirmationUrl)
      return true
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error)
      return false
    }
  }

  /**
   * Envia email de boas-vindas para subscriber confirmado
   */
  async sendWelcomeEmail(subscriberEmail: string): Promise<boolean> {
    try {
      const subscriber = await this.subscriberRepository.findByEmail(subscriberEmail)

      if (!subscriber || !subscriber.isActive()) {
        return false
      }

      const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000'
      const unsubscribeUrl = `${baseUrl}/unsubscribe/${subscriber.getUnsubscribeToken()}`

      await this.emailService.sendWelcomeEmail(subscriber.getEmail(), unsubscribeUrl)
      return true
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error)
      return false
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

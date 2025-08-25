import { SubscriberRepository } from '../repositories/SubscriberRepository'
import { Subscriber } from '../entities/Subscriber'
import { EmailService } from '../services/EmailService'

export interface SubscriptionResult {
  success: boolean
  message: string
  subscriber?: Subscriber
}

export interface UnsubscribeResult {
  success: boolean
  message: string
}

export interface ConfirmationResult {
  success: boolean
  message: string
}

/**
 * Use Case para gerenciar inscrições na newsletter
 * Implementa o Single Responsibility Principle
 */
export class SubscriptionUseCase {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private emailService: EmailService
  ) {}

  /**
   * Inscreve um novo email na newsletter
   * Cria o subscriber com status PENDING_CONFIRMATION
   */
  async subscribe(email: string, baseUrl: string): Promise<SubscriptionResult> {
    try {
      const existingSubscriber = await this.subscriberRepository.findByEmail(email)

      if (existingSubscriber) {
        if (existingSubscriber.isActive()) {
          return {
            success: false,
            message: 'Este email já está inscrito na newsletter',
          }
        }

        if (existingSubscriber.isPending()) {
          return {
            success: false,
            message: 'Já enviamos um email de confirmação. Verifique sua caixa de entrada.',
          }
        }

        if (existingSubscriber.isUnsubscribed()) {
          // Reativar subscriber existente
          const newSubscriber = Subscriber.create(email)
          await this.subscriberRepository.save(newSubscriber)

          return {
            success: true,
            message: 'Inscrição realizada com sucesso! Confirme seu email.',
            subscriber: newSubscriber,
          }
        }
      }

      const subscriber = Subscriber.create(email)
      await this.subscriberRepository.save(subscriber)

      const confirmationUrl = `${baseUrl}/api/confirm/${subscriber.getUnsubscribeToken()}`
      await this.emailService.sendConfirmationEmail(email, confirmationUrl)

      return {
        success: true,
        message: 'Inscrição realizada com sucesso! Confirme seu email.',
        subscriber,
      }
    } catch (_error) {
      return {
        success: false,
        message: 'Erro interno. Tente novamente mais tarde.',
      }
    }
  }

  /**
   * Confirma a inscrição via token de confirmação
   */
  async confirmSubscription(token: string): Promise<ConfirmationResult> {
    try {
      const subscriber = await this.subscriberRepository.findByToken(token)

      if (!subscriber) {
        return {
          success: false,
          message: 'Token de confirmação inválido',
        }
      }

      if (subscriber.isActive()) {
        return {
          success: true,
          message: 'Email já confirmado anteriormente',
        }
      }

      if (!subscriber.isPending()) {
        return {
          success: false,
          message: 'Este token não é válido para confirmação',
        }
      }

      subscriber.confirm()
      await this.subscriberRepository.save(subscriber)

      return {
        success: true,
        message: 'Email confirmado com sucesso! Bem-vindo ao Puro Suco!',
      }
    } catch (_error) {
      return {
        success: false,
        message: 'Erro interno. Tente novamente mais tarde.',
      }
    }
  }

  /**
   * Cancela inscrição via token de unsubscribe
   */
  async unsubscribe(email: string, token?: string): Promise<UnsubscribeResult> {
    try {
      const subscriber = token
        ? await this.subscriberRepository.findByToken(token)
        : await this.subscriberRepository.findByEmail(email)

      if (!subscriber) {
        return {
          success: false,
          message: 'Subscriber não encontrado',
        }
      }

      if (subscriber.isUnsubscribed()) {
        return {
          success: true,
          message: 'Você já havia cancelado a inscrição',
        }
      }

      subscriber.unsubscribe()
      await this.subscriberRepository.save(subscriber)

      return {
        success: true,
        message: 'Cancelamento realizado com sucesso',
      }
    } catch (_error) {
      return {
        success: false,
        message: 'Erro interno. Tente novamente mais tarde.',
      }
    }
  }

  /**
   * Retorna estatísticas básicas
   */
  async getStats(): Promise<{ activeCount: number }> {
    const activeCount = await this.subscriberRepository.getActiveCount()
    return { activeCount }
  }
}

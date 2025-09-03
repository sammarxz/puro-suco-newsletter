import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubscriptionUseCase } from '../SubscriptionUseCase'
import { Subscriber } from '../../entities/Subscriber'
import type { SubscriberRepository } from '../../repositories/SubscriberRepository'
import type { EmailService } from '../../services/EmailService'

// Mock implementations
const mockSubscriberRepository: SubscriberRepository = {
  save: vi.fn(),
  findByEmail: vi.fn(),
  findByToken: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  findAllActive: vi.fn(),
  findAllPending: vi.fn(),
  findBySubscriptionDate: vi.fn(),
  updateSubscriber: vi.fn(),
  deleteSubscriber: vi.fn(),
  getActiveCount: vi.fn(),
  getPendingCount: vi.fn(),
  getUnsubscribedCount: vi.fn(),
  getTotalCount: vi.fn(),
}

const mockEmailService: EmailService = {
  sendWelcomeEmail: vi.fn(),
  sendConfirmationEmail: vi.fn(),
  sendNewsletter: vi.fn(),
}

describe('SubscriptionUseCase', () => {
  let useCase: SubscriptionUseCase
  const baseUrl = 'https://example.com'

  beforeEach(() => {
    vi.clearAllMocks()
    useCase = new SubscriptionUseCase(mockSubscriberRepository, mockEmailService)
  })

  describe('subscribe', () => {
    it('should create new subscription for new email', async () => {
      const email = 'test@example.com'
      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(mockSubscriberRepository.save).mockResolvedValue()
      vi.mocked(mockEmailService.sendConfirmationEmail).mockResolvedValue()

      const result = await useCase.subscribe(email, baseUrl)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Inscrição realizada com sucesso')
      expect(mockSubscriberRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getEmail: expect.any(Function),
          isPending: expect.any(Function),
        })
      )
      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        email,
        expect.stringContaining('/confirm/')
      )
    })

    it('should reject already active subscription', async () => {
      const email = 'test@example.com'
      const existingSubscriber = Subscriber.create(email)
      existingSubscriber.confirm()

      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(existingSubscriber)

      const result = await useCase.subscribe(email, baseUrl)

      expect(result.success).toBe(false)
      expect(result.message).toContain('já está inscrito')
      expect(mockSubscriberRepository.save).not.toHaveBeenCalled()
      expect(mockEmailService.sendConfirmationEmail).not.toHaveBeenCalled()
    })

    it('should reject pending subscription', async () => {
      const email = 'test@example.com'
      const pendingSubscriber = Subscriber.create(email)

      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(pendingSubscriber)

      const result = await useCase.subscribe(email, baseUrl)

      expect(result.success).toBe(false)
      expect(result.message).toContain('email de confirmação')
      expect(mockSubscriberRepository.save).not.toHaveBeenCalled()
    })

    it('should handle email service errors gracefully', async () => {
      const email = 'test@example.com'
      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(mockSubscriberRepository.save).mockResolvedValue()
      vi.mocked(mockEmailService.sendConfirmationEmail).mockRejectedValue(new Error('Email failed'))

      const result = await useCase.subscribe(email, baseUrl)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Erro interno')
    })
  })

  describe('confirmSubscription', () => {
    it('should confirm pending subscription', async () => {
      const subscriber = Subscriber.create('test@example.com')
      const token = subscriber.getUnsubscribeToken()

      vi.mocked(mockSubscriberRepository.findByToken).mockResolvedValue(subscriber)
      vi.mocked(mockSubscriberRepository.save).mockResolvedValue()

      const result = await useCase.confirmSubscription(token, 'https://test.com')

      expect(result.success).toBe(true)
      expect(result.message).toContain('confirmado com sucesso')
      expect(subscriber.isActive()).toBe(true)
      expect(mockSubscriberRepository.save).toHaveBeenCalledWith(subscriber)
    })

    it('should reject invalid token', async () => {
      vi.mocked(mockSubscriberRepository.findByToken).mockResolvedValue(null)

      const result = await useCase.confirmSubscription('invalid-token', 'https://test.com')

      expect(result.success).toBe(false)
      expect(result.message).toContain('Token de confirmação inválido')
      expect(mockSubscriberRepository.save).not.toHaveBeenCalled()
    })

    it('should handle already confirmed subscription', async () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()
      const token = subscriber.getUnsubscribeToken()

      vi.mocked(mockSubscriberRepository.findByToken).mockResolvedValue(subscriber)

      const result = await useCase.confirmSubscription(token, 'https://test.com')

      expect(result.success).toBe(true)
      expect(result.message).toContain('já confirmado')
    })
  })

  describe('unsubscribe', () => {
    it('should unsubscribe active subscriber by email', async () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()

      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(subscriber)
      vi.mocked(mockSubscriberRepository.save).mockResolvedValue()

      const result = await useCase.unsubscribe('test@example.com')

      expect(result.success).toBe(true)
      expect(result.message).toContain('Cancelamento realizado com sucesso')
      expect(subscriber.isUnsubscribed()).toBe(true)
      expect(mockSubscriberRepository.save).toHaveBeenCalledWith(subscriber)
    })

    it('should unsubscribe by token', async () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()
      const token = subscriber.getUnsubscribeToken()

      vi.mocked(mockSubscriberRepository.findByToken).mockResolvedValue(subscriber)
      vi.mocked(mockSubscriberRepository.save).mockResolvedValue()

      const result = await useCase.unsubscribe('test@example.com', token)

      expect(result.success).toBe(true)
      expect(subscriber.isUnsubscribed()).toBe(true)
    })

    it('should handle subscriber not found', async () => {
      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(null)

      const result = await useCase.unsubscribe('nonexistent@example.com')

      expect(result.success).toBe(false)
      expect(result.message).toContain('Subscriber não encontrado')
    })

    it('should handle already unsubscribed', async () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()
      subscriber.unsubscribe()

      vi.mocked(mockSubscriberRepository.findByEmail).mockResolvedValue(subscriber)

      const result = await useCase.unsubscribe('test@example.com')

      expect(result.success).toBe(true)
      expect(result.message).toContain('já havia cancelado')
    })
  })

  describe('getStats', () => {
    it('should return active subscriber count', async () => {
      vi.mocked(mockSubscriberRepository.getActiveCount).mockResolvedValue(42)

      const result = await useCase.getStats()

      expect(result.activeCount).toBe(42)
      expect(mockSubscriberRepository.getActiveCount).toHaveBeenCalledOnce()
    })
  })
})

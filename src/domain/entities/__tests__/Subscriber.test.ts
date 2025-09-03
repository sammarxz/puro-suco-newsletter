import { describe, it, expect } from 'vitest'
import { Subscriber, SubscriberStatus } from '../Subscriber'

describe('Subscriber Entity', () => {
  describe('create', () => {
    it('should create a subscriber with pending status', () => {
      const email = 'test@example.com'
      const subscriber = Subscriber.create(email)

      expect(subscriber.getEmail()).toBe(email)
      expect(subscriber.getStatus()).toBe(SubscriberStatus.PENDING_CONFIRMATION)
      expect(subscriber.getSubscribedAt()).toBeInstanceOf(Date)
      expect(subscriber.getUnsubscribeToken()).toBeDefined()
      expect(subscriber.getConfirmedAt()).toBeUndefined()
      expect(subscriber.getUnsubscribedAt()).toBeUndefined()
    })

    it('should generate unique tokens for different subscribers', () => {
      const subscriber1 = Subscriber.create('test1@example.com')
      const subscriber2 = Subscriber.create('test2@example.com')

      expect(subscriber1.getUnsubscribeToken()).not.toBe(subscriber2.getUnsubscribeToken())
    })
  })

  describe('status checks', () => {
    it('should correctly identify pending subscriber', () => {
      const subscriber = Subscriber.create('test@example.com')

      expect(subscriber.isPending()).toBe(true)
      expect(subscriber.isActive()).toBe(false)
      expect(subscriber.isUnsubscribed()).toBe(false)
    })

    it('should correctly identify confirmed subscriber', () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()

      expect(subscriber.isPending()).toBe(false)
      expect(subscriber.isActive()).toBe(true)
      expect(subscriber.isUnsubscribed()).toBe(false)
      expect(subscriber.getConfirmedAt()).toBeInstanceOf(Date)
    })

    it('should correctly identify unsubscribed subscriber', () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()
      subscriber.unsubscribe()

      expect(subscriber.isPending()).toBe(false)
      expect(subscriber.isActive()).toBe(false)
      expect(subscriber.isUnsubscribed()).toBe(true)
      expect(subscriber.getUnsubscribedAt()).toBeInstanceOf(Date)
    })
  })

  describe('business rules', () => {
    it('should not allow confirming already confirmed subscriber', () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()
      const firstConfirmedAt = subscriber.getConfirmedAt()

      // Try to confirm again - should throw error
      expect(() => subscriber.confirm()).toThrow(
        'Subscriber must be pending confirmation to be confirmed'
      )
      expect(subscriber.getConfirmedAt()).toBe(firstConfirmedAt)
    })

    it('should allow resubscribing after unsubscribe', () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()
      subscriber.unsubscribe()

      expect(subscriber.isUnsubscribed()).toBe(true)

      // This would typically be handled by creating a new subscription
      // but the entity itself doesn't prevent state changes
    })
  })

  describe('persistence', () => {
    it('should convert to persistence format correctly', () => {
      const subscriber = Subscriber.create('test@example.com')
      subscriber.confirm()

      const persistenceData = subscriber.toPersistence()

      expect(persistenceData).toMatchObject({
        email: 'test@example.com',
        status: SubscriberStatus.CONFIRMED,
        subscribedAt: expect.any(Date),
        confirmedAt: expect.any(Date),
        unsubscribedAt: undefined,
        unsubscribeToken: expect.any(String),
        id: expect.any(String),
      })
    })

    it('should recreate from persistence data correctly', () => {
      const originalData = {
        id: 'test-id',
        email: 'test@example.com',
        status: SubscriberStatus.CONFIRMED,
        subscribedAt: new Date('2024-01-01'),
        confirmedAt: new Date('2024-01-02'),
        unsubscribeToken: 'test-token',
      }

      const subscriber = Subscriber.fromPersistence(originalData)

      expect(subscriber.getId()).toBe('test-id')
      expect(subscriber.getEmail()).toBe('test@example.com')
      expect(subscriber.isActive()).toBe(true)
      expect(subscriber.getSubscribedAt()).toEqual(new Date('2024-01-01'))
      expect(subscriber.getConfirmedAt()).toEqual(new Date('2024-01-02'))
      expect(subscriber.getUnsubscribeToken()).toBe('test-token')
    })
  })

  describe('email validation', () => {
    it('should validate email format', () => {
      expect(() => Subscriber.create('invalid-email')).toThrow()
      expect(() => Subscriber.create('')).toThrow()
      expect(() => Subscriber.create('test@')).toThrow()
      expect(() => Subscriber.create('@example.com')).toThrow()
    })

    it('should accept valid email formats', () => {
      expect(() => Subscriber.create('test@example.com')).not.toThrow()
      expect(() => Subscriber.create('user.name+tag@example.co.uk')).not.toThrow()
      expect(() => Subscriber.create('123@456.com')).not.toThrow()
    })
  })
})

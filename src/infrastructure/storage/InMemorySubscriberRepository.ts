import type { SubscriberRepository } from '../../domain/repositories/SubscriberRepository'
import { Subscriber } from '../../domain/entities/Subscriber'

/**
 * In-memory implementation of SubscriberRepository for testing
 */
export class InMemorySubscriberRepository implements SubscriberRepository {
  private subscribers: Map<string, Subscriber> = new Map()
  private emailIndex: Map<string, string> = new Map()
  private tokenIndex: Map<string, string> = new Map()

  async save(subscriber: Subscriber): Promise<void> {
    const id = subscriber.getId()
    const email = subscriber.getEmail()
    const token = subscriber.getUnsubscribeToken()

    this.subscribers.set(id, subscriber)
    this.emailIndex.set(email, id)
    this.tokenIndex.set(token, id)
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const id = this.emailIndex.get(email)
    if (!id) return null
    return this.subscribers.get(id) || null
  }

  async findByToken(token: string): Promise<Subscriber | null> {
    const id = this.tokenIndex.get(token)
    if (!id) return null
    return this.subscribers.get(id) || null
  }

  async findById(id: string): Promise<Subscriber | null> {
    return this.subscribers.get(id) || null
  }

  async findAll(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values())
  }

  async findAllActive(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).filter(sub => sub.isActive())
  }

  async findAllPending(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).filter(sub => sub.isPending())
  }

  async findBySubscriptionDate(startDate: Date, endDate: Date): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).filter(sub => {
      const subDate = sub.getSubscribedAt()
      return subDate >= startDate && subDate <= endDate
    })
  }

  async updateSubscriber(subscriber: Subscriber): Promise<void> {
    await this.save(subscriber)
  }

  async deleteSubscriber(id: string): Promise<void> {
    const subscriber = this.subscribers.get(id)
    if (subscriber) {
      this.subscribers.delete(id)
      this.emailIndex.delete(subscriber.getEmail())
      this.tokenIndex.delete(subscriber.getUnsubscribeToken())
    }
  }

  async getActiveCount(): Promise<number> {
    return (await this.findAllActive()).length
  }

  async getPendingCount(): Promise<number> {
    return (await this.findAllPending()).length
  }

  async getUnsubscribedCount(): Promise<number> {
    return Array.from(this.subscribers.values()).filter(sub => sub.isUnsubscribed()).length
  }

  async getTotalCount(): Promise<number> {
    return this.subscribers.size
  }

  // Test utility methods
  clear(): void {
    this.subscribers.clear()
    this.emailIndex.clear()
    this.tokenIndex.clear()
  }
}

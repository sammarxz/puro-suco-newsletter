import { Subscriber } from '../entities/Subscriber'

export interface SubscriberRepository {
  save(subscriber: Subscriber): Promise<void>
  findByEmail(email: string): Promise<Subscriber | null>
  findByToken(token: string): Promise<Subscriber | null>
  findById(id: string): Promise<Subscriber | null>
  findAll(): Promise<Subscriber[]>
  findAllActive(): Promise<Subscriber[]>
  findAllPending(): Promise<Subscriber[]>
  findBySubscriptionDate(startDate: Date, endDate: Date): Promise<Subscriber[]>
  updateSubscriber(subscriber: Subscriber): Promise<void>
  deleteSubscriber(id: string): Promise<void>
  getActiveCount(): Promise<number>
  getPendingCount(): Promise<number>
  getUnsubscribedCount(): Promise<number>
  getTotalCount(): Promise<number>
}

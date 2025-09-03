import type { SubscriberRepository } from '../../domain/repositories/SubscriberRepository'
import { Subscriber, SubscriberStatus } from '../../domain/entities/Subscriber'
import { tursoClient } from '../database/turso-client'

/**
 * Implementação do SubscriberRepository usando Turso DB
 * Implementa o Repository Pattern para persistência de dados
 */
export class TursoSubscriberRepository implements SubscriberRepository {
  async save(subscriber: Subscriber): Promise<void> {
    const data = subscriber.toPersistence()

    // Verificar se o subscriber já existe (por ID primeiro, depois por token)
    const existingById = await tursoClient.execute(
      'SELECT id FROM subscribers WHERE id = ? LIMIT 1',
      [data.id]
    )

    const existingByToken = await tursoClient.execute(
      'SELECT id FROM subscribers WHERE unsubscribe_token = ? LIMIT 1',
      [data.unsubscribeToken]
    )

    if (existingById.rows.length > 0 || existingByToken.rows.length > 0) {
      // Subscriber existe - fazer UPDATE
      await tursoClient.execute(
        `UPDATE subscribers 
         SET email = ?, status = ?, confirmed_at = ?, unsubscribed_at = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? OR unsubscribe_token = ?`,
        [
          data.email,
          data.status,
          data.confirmedAt?.toISOString() || null,
          data.unsubscribedAt?.toISOString() || null,
          data.id,
          data.unsubscribeToken,
        ]
      )
    } else {
      // Subscriber não existe - fazer INSERT
      await tursoClient.execute(
        `INSERT INTO subscribers 
         (id, email, status, subscribed_at, confirmed_at, unsubscribed_at, unsubscribe_token) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id,
          data.email,
          data.status,
          data.subscribedAt.toISOString(),
          data.confirmedAt?.toISOString() || null,
          data.unsubscribedAt?.toISOString() || null,
          data.unsubscribeToken,
        ]
      )
    }
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const result = await tursoClient.execute('SELECT * FROM subscribers WHERE email = ? LIMIT 1', [
      email,
    ])

    if (result.rows.length === 0 || !result.rows[0]) {
      return null
    }

    return this.rowToSubscriber(result.rows[0])
  }

  async findByToken(token: string): Promise<Subscriber | null> {
    const result = await tursoClient.execute(
      'SELECT * FROM subscribers WHERE unsubscribe_token = ? LIMIT 1',
      [token]
    )

    if (result.rows.length === 0 || !result.rows[0]) {
      return null
    }

    return this.rowToSubscriber(result.rows[0])
  }

  async findById(id: string): Promise<Subscriber | null> {
    const result = await tursoClient.execute('SELECT * FROM subscribers WHERE id = ? LIMIT 1', [id])

    if (result.rows.length === 0 || !result.rows[0]) {
      return null
    }

    return this.rowToSubscriber(result.rows[0])
  }

  async findAll(): Promise<Subscriber[]> {
    const result = await tursoClient.execute(
      'SELECT * FROM subscribers ORDER BY subscribed_at DESC'
    )

    return result.rows.map(row => this.rowToSubscriber(row))
  }

  async findAllActive(): Promise<Subscriber[]> {
    const result = await tursoClient.execute(
      'SELECT * FROM subscribers WHERE status = ? ORDER BY subscribed_at DESC',
      [SubscriberStatus.CONFIRMED]
    )

    return result.rows.map(row => this.rowToSubscriber(row))
  }

  async getActiveCount(): Promise<number> {
    const result = await tursoClient.execute(
      'SELECT COUNT(*) as count FROM subscribers WHERE status = ?',
      [SubscriberStatus.CONFIRMED]
    )

    return (result.rows[0]?.count as number) ?? 0
  }

  async findAllPending(): Promise<Subscriber[]> {
    const result = await tursoClient.execute(
      'SELECT * FROM subscribers WHERE status = ? ORDER BY subscribed_at DESC',
      [SubscriberStatus.PENDING_CONFIRMATION]
    )

    return result.rows.map(row => this.rowToSubscriber(row))
  }

  async findBySubscriptionDate(startDate: Date, endDate: Date): Promise<Subscriber[]> {
    const result = await tursoClient.execute(
      'SELECT * FROM subscribers WHERE subscribed_at BETWEEN ? AND ? ORDER BY subscribed_at DESC',
      [startDate.toISOString(), endDate.toISOString()]
    )

    return result.rows.map(row => this.rowToSubscriber(row))
  }

  async updateSubscriber(subscriber: Subscriber): Promise<void> {
    const data = subscriber.toPersistence()

    await tursoClient.execute(
      `UPDATE subscribers 
       SET email = ?, status = ?, confirmed_at = ?, unsubscribed_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.email,
        data.status,
        data.confirmedAt?.toISOString() || null,
        data.unsubscribedAt?.toISOString() || null,
        data.id,
      ]
    )
  }

  async deleteSubscriber(id: string): Promise<void> {
    await tursoClient.execute('DELETE FROM subscribers WHERE id = ?', [id])
  }

  async getPendingCount(): Promise<number> {
    const result = await tursoClient.execute(
      'SELECT COUNT(*) as count FROM subscribers WHERE status = ?',
      [SubscriberStatus.PENDING_CONFIRMATION]
    )

    return (result.rows[0]?.count as number) ?? 0
  }

  async getUnsubscribedCount(): Promise<number> {
    const result = await tursoClient.execute(
      'SELECT COUNT(*) as count FROM subscribers WHERE status = ?',
      [SubscriberStatus.UNSUBSCRIBED]
    )

    return (result.rows[0]?.count as number) ?? 0
  }

  async getTotalCount(): Promise<number> {
    const result = await tursoClient.execute('SELECT COUNT(*) as count FROM subscribers')
    return (result.rows[0]?.count as number) ?? 0
  }

  async getSubscriptionStats(): Promise<{
    total: number
    active: number
    pending: number
    unsubscribed: number
  }> {
    const [total, active, pending, unsubscribed] = await Promise.all([
      this.getTotalCount(),
      this.getActiveCount(),
      this.getPendingCount(),
      this.getUnsubscribedCount(),
    ])

    return { total, active, pending, unsubscribed }
  }

  /**
   * Converte uma linha do banco em uma entidade Subscriber
   */
  private rowToSubscriber(row: Record<string, unknown>): Subscriber {
    interface SubscriberData {
      id: string
      email: string
      status: SubscriberStatus
      subscribedAt: Date
      unsubscribeToken: string
      confirmedAt?: Date
      unsubscribedAt?: Date
    }

    const data: SubscriberData = {
      id: row.id as string,
      email: row.email as string,
      status: row.status as SubscriberStatus,
      subscribedAt: new Date(row.subscribed_at as string),
      unsubscribeToken: row.unsubscribe_token as string,
    }

    if (row.confirmed_at) {
      data.confirmedAt = new Date(row.confirmed_at as string)
    }

    if (row.unsubscribed_at) {
      data.unsubscribedAt = new Date(row.unsubscribed_at as string)
    }

    return Subscriber.fromPersistence(data)
  }
}

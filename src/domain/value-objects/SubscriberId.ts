import { randomUUID } from 'crypto'

/**
 * SubscriberId Value Object
 * Garante que sempre temos um ID válido para subscribers
 */
export class SubscriberId {
  private readonly value: string

  constructor(id?: string) {
    this.value = id || randomUUID()
  }

  getValue(): string {
    return this.value
  }

  equals(other: SubscriberId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

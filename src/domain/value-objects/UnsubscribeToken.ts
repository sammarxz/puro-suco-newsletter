import { randomBytes } from 'crypto'

/**
 * UnsubscribeToken Value Object
 * Gera tokens seguros para unsubscribe
 */
export class UnsubscribeToken {
  private readonly value: string

  constructor(token?: string) {
    this.value = token || this.generateSecureToken()
  }

  getValue(): string {
    return this.value
  }

  equals(other: UnsubscribeToken): boolean {
    return this.value === other.value
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString('hex')
  }

  toString(): string {
    return this.value
  }
}

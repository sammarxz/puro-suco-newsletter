import { Email } from '../value-objects/Email'
import { SubscriberId } from '../value-objects/SubscriberId'
import { UnsubscribeToken } from '../value-objects/UnsubscribeToken'

/**
 * Status do subscriber seguindo o padrão de confirmação por email
 */
export enum SubscriberStatus {
  PENDING_CONFIRMATION = 'pending_confirmation',
  CONFIRMED = 'confirmed',
  UNSUBSCRIBED = 'unsubscribed',
}

/**
 * Subscriber Entity
 * Encapsula as regras de negócio para gerenciamento de inscrições
 */
export class Subscriber {
  private constructor(
    private readonly id: SubscriberId,
    private readonly email: Email,
    private status: SubscriberStatus,
    private readonly subscribedAt: Date,
    private readonly unsubscribeToken: UnsubscribeToken,
    private confirmedAt?: Date,
    private unsubscribedAt?: Date
  ) {}

  static create(email: string): Subscriber {
    return new Subscriber(
      new SubscriberId(),
      new Email(email),
      SubscriberStatus.PENDING_CONFIRMATION,
      new Date(),
      new UnsubscribeToken()
    )
  }

  static fromPersistence(data: {
    id: string
    email: string
    status: SubscriberStatus
    subscribedAt: Date
    unsubscribeToken: string
    confirmedAt?: Date
    unsubscribedAt?: Date
  }): Subscriber {
    return new Subscriber(
      new SubscriberId(data.id),
      new Email(data.email),
      data.status,
      data.subscribedAt,
      new UnsubscribeToken(data.unsubscribeToken),
      data.confirmedAt,
      data.unsubscribedAt
    )
  }

  // Getters
  getId(): string {
    return this.id.getValue()
  }

  getEmail(): string {
    return this.email.getValue()
  }

  getStatus(): SubscriberStatus {
    return this.status
  }

  getSubscribedAt(): Date {
    return this.subscribedAt
  }

  getUnsubscribeToken(): string {
    return this.unsubscribeToken.getValue()
  }

  getConfirmedAt(): Date | undefined {
    return this.confirmedAt
  }

  getUnsubscribedAt(): Date | undefined {
    return this.unsubscribedAt
  }

  // Business methods
  confirm(): void {
    if (this.status !== SubscriberStatus.PENDING_CONFIRMATION) {
      throw new Error('Subscriber must be pending confirmation to be confirmed')
    }
    this.status = SubscriberStatus.CONFIRMED
    this.confirmedAt = new Date()
  }

  unsubscribe(): void {
    if (this.status === SubscriberStatus.UNSUBSCRIBED) {
      throw new Error('Subscriber is already unsubscribed')
    }
    this.status = SubscriberStatus.UNSUBSCRIBED
    this.unsubscribedAt = new Date()
  }

  isActive(): boolean {
    return this.status === SubscriberStatus.CONFIRMED
  }

  isPending(): boolean {
    return this.status === SubscriberStatus.PENDING_CONFIRMATION
  }

  isUnsubscribed(): boolean {
    return this.status === SubscriberStatus.UNSUBSCRIBED
  }

  // Para persistência
  toPersistence() {
    return {
      id: this.getId(),
      email: this.getEmail(),
      status: this.getStatus(),
      subscribedAt: this.getSubscribedAt(),
      unsubscribeToken: this.getUnsubscribeToken(),
      confirmedAt: this.getConfirmedAt(),
      unsubscribedAt: this.getUnsubscribedAt(),
    }
  }
}

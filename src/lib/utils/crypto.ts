import { randomBytes } from 'crypto'

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function generateId(): string {
  return randomBytes(16).toString('hex')
}

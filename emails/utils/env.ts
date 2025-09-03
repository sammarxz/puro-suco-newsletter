/**
 * Utility functions for accessing environment variables in email templates
 */

/**
 * Get the site URL from environment variables
 * Falls back to localhost for development if not set
 */
export function getSiteUrl(): string {
  // Use process.env for Node.js environments (email rendering)
  return process.env.PUBLIC_SITE_URL || 'http://localhost:4321'
}

/**
 * Create URLs relative to the site base URL
 */
export function createSiteUrl(path: string = ''): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Create unsubscribe URL with token
 */
export function createUnsubscribeUrl(token: string): string {
  return createSiteUrl(`/unsubscribe/${token}`)
}

/**
 * Create confirmation URL with token
 */
export function createConfirmationUrl(token: string): string {
  return createSiteUrl(`/confirm/${token}`)
}

/**
 * Get logo URL
 */
export function getLogoUrl(): string {
  return createSiteUrl('/logo.svg')
}

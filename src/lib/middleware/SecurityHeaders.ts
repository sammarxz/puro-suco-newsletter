export interface SecurityHeaders {
  'Content-Type': string
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Content-Security-Policy'?: string
  'Access-Control-Allow-Origin': string
  'Access-Control-Allow-Methods': string
  'Access-Control-Allow-Headers': string
}

export class SecurityHeadersBuilder {
  private headers: Partial<SecurityHeaders> = {}

  constructor() {
    this.setDefaults()
  }

  private setDefaults(): this {
    this.headers = {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
    return this
  }

  withCSP(policy: string): this {
    this.headers['Content-Security-Policy'] = policy
    return this
  }

  withCORS(
    origin: string = '*',
    methods: string = 'GET, POST, OPTIONS',
    headers: string = 'Content-Type, Authorization'
  ): this {
    this.headers['Access-Control-Allow-Origin'] = origin
    this.headers['Access-Control-Allow-Methods'] = methods
    this.headers['Access-Control-Allow-Headers'] = headers
    return this
  }

  withContentType(type: string): this {
    this.headers['Content-Type'] = type
    return this
  }

  build(): Record<string, string> {
    return this.headers as Record<string, string>
  }

  static json(): Record<string, string> {
    return new SecurityHeadersBuilder().withContentType('application/json').build()
  }

  static api(): Record<string, string> {
    return new SecurityHeadersBuilder()
      .withContentType('application/json')
      .withCSP("default-src 'self'")
      .build()
  }
}

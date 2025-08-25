type Constructor<T = object> = new (...args: unknown[]) => T
type ServiceFactory<T> = () => T | Promise<T>

export class DIContainer {
  private services = new Map<string, unknown>()
  private factories = new Map<string, ServiceFactory<unknown>>()
  private singletons = new Map<string, unknown>()

  register<T>(token: string, factory: ServiceFactory<T>, singleton: boolean = true): void {
    this.factories.set(token, factory as ServiceFactory<unknown>)
    if (singleton) {
      this.services.set(token, null)
    }
  }

  registerClass<T>(token: string, constructor: Constructor<T>, singleton: boolean = true): void {
    this.register(token, () => new constructor(), singleton)
  }

  registerInstance<T>(token: string, instance: T): void {
    this.singletons.set(token, instance)
  }

  async resolve<T>(token: string): Promise<T> {
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T
    }

    if (this.services.has(token)) {
      let instance = this.services.get(token)
      if (instance === null) {
        const factory = this.factories.get(token)
        if (!factory) {
          throw new Error(`Service '${token}' not found`)
        }
        instance = await factory()
        this.services.set(token, instance)
      }
      return instance as T
    }

    const factory = this.factories.get(token)
    if (!factory) {
      throw new Error(`Service '${token}' not found`)
    }

    return (await factory()) as T
  }

  has(token: string): boolean {
    return this.services.has(token) || this.factories.has(token) || this.singletons.has(token)
  }

  clear(): void {
    this.services.clear()
    this.factories.clear()
    this.singletons.clear()
  }
}

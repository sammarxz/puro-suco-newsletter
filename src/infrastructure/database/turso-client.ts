import { createClient, type Client } from '@libsql/client'

/**
 * Turso Database Client Configuration
 * Singleton pattern para garantir uma única instância da conexão
 */
class TursoClient {
  private static instance: TursoClient
  private client: Client

  private constructor() {
    // Suporte para ambos import.meta.env (Astro) e process.env (Node.js)
    const databaseUrl = import.meta.env?.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL
    const authToken = import.meta.env?.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

    if (!databaseUrl) {
      throw new Error('TURSO_DATABASE_URL environment variable is required')
    }

    if (!authToken) {
      throw new Error('TURSO_AUTH_TOKEN environment variable is required')
    }

    this.client = createClient({
      url: databaseUrl,
      authToken: authToken,
    })
  }

  public static getInstance(): TursoClient {
    if (!TursoClient.instance) {
      TursoClient.instance = new TursoClient()
    }
    return TursoClient.instance
  }

  public getClient(): Client {
    return this.client
  }

  /**
   * Execute uma query com tratamento de erros
   */
  public async execute(sql: string, args?: any[]) {
    try {
      return await this.client.execute({ sql, args })
    } catch (error) {
      console.error('Turso query error:', error)
      throw error
    }
  }

  /**
   * Execute múltiplas queries em uma transação usando batch
   */
  public async batch(queries: Array<{ sql: string; args?: any[] }>) {
    try {
      return await this.client.batch(queries.map(({ sql, args }) => ({ sql, args })))
    } catch (error) {
      console.error('Turso batch error:', error)
      throw error
    }
  }

  /**
   * Execute múltiplas queries em uma transação com callback
   */
  public async transaction<T>(
    callback: (tx: { execute: (sql: string, args?: any[]) => Promise<any> }) => Promise<T>
  ): Promise<T> {
    try {
      // Para Turso, vamos simular transação coletando as queries e executando como batch
      const queries: Array<{ sql: string; args?: any[] }> = []

      const tx = {
        execute: (sql: string, args?: any[]) => {
          queries.push({ sql, args })
          return Promise.resolve({ rows: [], rowsAffected: 0 })
        },
      }

      await callback(tx)

      if (queries.length > 0) {
        return (await this.batch(queries)) as T
      }

      return {} as T
    } catch (error) {
      console.error('Turso transaction error:', error)
      throw error
    }
  }

  /**
   * Fechar conexão (útil para testes)
   */
  public async close() {
    await this.client.close()
  }
}

// Lazy initialization - criado apenas quando necessário
export const tursoClient = {
  execute: (sql: string, args?: any[]) => TursoClient.getInstance().execute(sql, args),
  batch: (queries: Array<{ sql: string; args?: any[] }>) =>
    TursoClient.getInstance().batch(queries),
  transaction: <T>(
    callback: (tx: { execute: (sql: string, args?: any[]) => Promise<any> }) => Promise<T>
  ) => TursoClient.getInstance().transaction(callback),
  close: () => TursoClient.getInstance().close(),
}

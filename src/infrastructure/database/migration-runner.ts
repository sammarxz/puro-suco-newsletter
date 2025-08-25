import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tursoClient } from './turso-client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Database Migration Runner
 * Executa as migrations do banco de dados
 */
export class MigrationRunner {
  /**
   * Executa todas as migrations
   */
  static async runMigrations(): Promise<void> {
    try {
      console.log('Running database migrations...')

      const migrationSQL = readFileSync(join(__dirname, 'migrations.sql'), 'utf-8')

      // Divide o SQL em statements individuais
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

      // Executa cada statement
      for (const statement of statements) {
        if (statement.trim()) {
          await tursoClient.execute(statement)
        }
      }

      console.log('Database migrations completed successfully!')
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }

  /**
   * Verifica se as tabelas existem
   */
  static async checkTables(): Promise<boolean> {
    try {
      const result = await tursoClient.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('subscribers', 'newsletter_issues')"
      )

      return result.rows.length >= 2
    } catch (error) {
      console.error('Error checking tables:', error)
      return false
    }
  }

  /**
   * Seed inicial de dados (se necessário)
   */
  static async seedData(): Promise<void> {
    try {
      // Verificar se já existem dados
      const subscriberCount = await tursoClient.execute('SELECT COUNT(*) as count FROM subscribers')

      // Se não houver subscribers, podemos adicionar dados de teste (opcional)
      const count = subscriberCount.rows[0].count as number

      if (count === 0) {
        console.log('Database is empty - ready for production use')
      } else {
        console.log(`Database has ${count} subscribers`)
      }
    } catch (error) {
      console.error('Error seeding data:', error)
      throw error
    }
  }
}

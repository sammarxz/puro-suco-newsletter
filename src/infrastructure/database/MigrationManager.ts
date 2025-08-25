import { tursoClient } from './turso-client'
import crypto from 'crypto'

export interface Migration {
  version: string
  name: string
  up: string
  down: string
}

export class MigrationManager {
  async initMigrationTable(): Promise<void> {
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS migration_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        rollback_sql TEXT,
        checksum TEXT
      )
    `)
  }

  async getAppliedMigrations(): Promise<string[]> {
    await this.initMigrationTable()
    const result = await tursoClient.execute(
      'SELECT version FROM migration_history ORDER BY version'
    )
    return result.rows.map(row => row.version as string)
  }

  async applyMigration(migration: Migration): Promise<void> {
    const checksum = this.calculateChecksum(migration.up)

    try {
      // Dividir o SQL em declarações individuais
      const statements = this.splitSqlStatements(migration.up)

      // Executar todas as declarações sequencialmente
      for (const statement of statements) {
        if (statement.trim()) {
          await tursoClient.execute(statement)
        }
      }

      // Registrar na history
      await tursoClient.execute(
        'INSERT INTO migration_history (version, name, rollback_sql, checksum) VALUES (?, ?, ?, ?)',
        [migration.version, migration.name, migration.down, checksum]
      )

      console.log(`✅ Applied migration: ${migration.version} - ${migration.name}`)
    } catch (error) {
      console.error(`❌ Failed to apply migration: ${migration.version}`, error)
      throw error
    }
  }

  async rollbackMigration(version: string): Promise<void> {
    const result = await tursoClient.execute(
      'SELECT rollback_sql FROM migration_history WHERE version = ?',
      [version]
    )

    if (result.rows.length === 0) {
      throw new Error(`Migration ${version} not found`)
    }

    const rollbackSql = result.rows[0].rollback_sql as string

    try {
      await tursoClient.transaction(async tx => {
        // Executar rollback
        await tx.execute(rollbackSql)

        // Remover da history
        await tx.execute('DELETE FROM migration_history WHERE version = ?', [version])
      })

      console.log(`↩️  Rolled back migration: ${version}`)
    } catch (error) {
      console.error(`❌ Failed to rollback migration: ${version}`, error)
      throw error
    }
  }

  async runPendingMigrations(migrations: Migration[]): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations()
    const pendingMigrations = migrations.filter(m => !appliedMigrations.includes(m.version))

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations')
      return
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migrations`)

    for (const migration of pendingMigrations) {
      await this.applyMigration(migration)
    }
  }

  async getMigrationStatus(): Promise<{
    appliedMigrations: Array<{
      version: string
      name: string
      appliedAt: string
    }>
    totalMigrations: number
  }> {
    const result = await tursoClient.execute(
      'SELECT version, name, applied_at FROM migration_history ORDER BY version'
    )

    return {
      appliedMigrations: result.rows.map(row => ({
        version: row.version as string,
        name: row.name as string,
        appliedAt: row.applied_at as string,
      })),
      totalMigrations: result.rows.length,
    }
  }

  private calculateChecksum(sql: string): string {
    return crypto.createHash('sha256').update(sql).digest('hex')
  }

  private splitSqlStatements(sql: string): string[] {
    // Remove comentários e quebra por ponto e vírgula
    const cleaned = sql
      .replace(/--[^\r\n]*/g, '') // Remove comentários de linha
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco

    // Divide por ponto e vírgula, mas preserva dentro de strings e blocos
    const statements: string[] = []
    let current = ''
    let inString = false
    let inBlock = false

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i]
      const nextChar = cleaned[i + 1]

      if (char === "'" && !inString) {
        inString = true
      } else if (char === "'" && inString) {
        inString = false
      } else if (!inString) {
        if (char === 'B' && nextChar === 'E' && cleaned.slice(i, i + 5) === 'BEGIN') {
          inBlock = true
        } else if (char === 'E' && nextChar === 'N' && cleaned.slice(i, i + 3) === 'END') {
          inBlock = false
        }
      }

      if (char === ';' && !inString && !inBlock) {
        if (current.trim()) {
          statements.push(current.trim())
        }
        current = ''
      } else {
        current += char
      }
    }

    // Adiciona a última declaração se houver
    if (current.trim()) {
      statements.push(current.trim())
    }

    return statements
  }

  async validateMigrations(migrations: Migration[]): Promise<boolean> {
    const appliedMigrations = await this.getAppliedMigrations()

    for (const appliedVersion of appliedMigrations) {
      const migration = migrations.find(m => m.version === appliedVersion)
      if (!migration) {
        console.warn(`⚠️  Applied migration ${appliedVersion} not found in migration files`)
        continue
      }

      const result = await tursoClient.execute(
        'SELECT checksum FROM migration_history WHERE version = ?',
        [appliedVersion]
      )

      if (result.rows.length > 0) {
        const storedChecksum = result.rows[0].checksum as string
        const currentChecksum = this.calculateChecksum(migration.up)

        if (storedChecksum !== currentChecksum) {
          console.error(`❌ Migration checksum mismatch: ${appliedVersion}`)
          return false
        }
      }
    }

    return true
  }
}

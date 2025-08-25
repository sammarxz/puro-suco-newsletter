#!/usr/bin/env node

/**
 * Database Setup Script
 * Executa migrations e configurações iniciais do banco
 */

import { config } from 'dotenv'
import { MigrationManager, migrations } from '../src/infrastructure/database/migrations'

config()

async function setupDatabase() {
  console.log('🚀 Setting up Turso database...\n')

  try {
    const migrationManager = new MigrationManager()

    console.log('🔍 Validating existing migrations...')
    const isValid = await migrationManager.validateMigrations(migrations)
    if (!isValid) {
      console.error('❌ Migration validation failed')
      process.exit(1)
    }

    console.log('📋 Running pending migrations...')
    await migrationManager.runPendingMigrations(migrations)

    const status = await migrationManager.getMigrationStatus()
    console.log(`✅ ${status.totalMigrations} migrations applied`)

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your environment')
    console.log('2. Deploy your application')
    console.log('3. Start collecting newsletter subscribers!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
}

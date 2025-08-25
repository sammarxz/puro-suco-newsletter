import type { Migration } from '../MigrationManager'
import { migration_001 } from './001_create_subscribers'

export const migrations: Migration[] = [migration_001]

export { MigrationManager } from '../MigrationManager'

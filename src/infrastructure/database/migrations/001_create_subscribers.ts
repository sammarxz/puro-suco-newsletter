import type { Migration } from '../MigrationManager'

export const migration_001: Migration = {
  version: '001',
  name: 'create_subscribers_table',
  up: `
    CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK (status IN ('pending_confirmation', 'confirmed', 'unsubscribed')),
      subscribed_at DATETIME NOT NULL,
      confirmed_at DATETIME,
      unsubscribed_at DATETIME,
      unsubscribe_token TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
    CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
    CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers(unsubscribe_token);
    CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON subscribers(subscribed_at);

    -- Trigger for automatic timestamp updates
    CREATE TRIGGER IF NOT EXISTS update_subscribers_updated_at
      AFTER UPDATE ON subscribers
    BEGIN
      UPDATE subscribers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `,
  down: `
    DROP TRIGGER IF EXISTS update_subscribers_updated_at;
    DROP INDEX IF EXISTS idx_subscribers_subscribed_at;
    DROP INDEX IF EXISTS idx_subscribers_token;
    DROP INDEX IF EXISTS idx_subscribers_status;
    DROP INDEX IF EXISTS idx_subscribers_email;
    DROP TABLE IF EXISTS subscribers;
  `,
}

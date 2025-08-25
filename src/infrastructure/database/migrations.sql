-- Migration: Create subscribers table
-- This file contains the database schema for the newsletter system

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

-- Create newsletter_issues table for tracking sent newsletters (future feature)
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  issue_number INTEGER NOT NULL,
  published_at DATETIME NOT NULL,
  tags TEXT, -- JSON array as text
  reading_time INTEGER NOT NULL,
  preview_text TEXT,
  sent_at DATETIME,
  sent_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for newsletter_issues
CREATE INDEX IF NOT EXISTS idx_newsletter_slug ON newsletter_issues(slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_published_at ON newsletter_issues(published_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_issue_number ON newsletter_issues(issue_number);

-- Create newsletter_sends table to track individual sends (for analytics)
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id TEXT PRIMARY KEY,
  newsletter_issue_id TEXT NOT NULL,
  subscriber_id TEXT NOT NULL,
  sent_at DATETIME NOT NULL,
  opened_at DATETIME,
  clicked_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (newsletter_issue_id) REFERENCES newsletter_issues(id),
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

-- Create indexes for newsletter_sends
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_newsletter_id ON newsletter_sends(newsletter_issue_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_subscriber_id ON newsletter_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_sent_at ON newsletter_sends(sent_at);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_subscribers_updated_at
  AFTER UPDATE ON subscribers
  FOR EACH ROW
BEGIN
  UPDATE subscribers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_newsletter_issues_updated_at
  AFTER UPDATE ON newsletter_issues
  FOR EACH ROW
BEGIN
  UPDATE newsletter_issues SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
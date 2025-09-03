#!/bin/sh

# Start health check server in background (para Railway/Fly.io compatibility)
tsx scripts/health-check.ts &

# Start newsletter watcher in background
tsx scripts/watch-newsletter.ts &

# Start the main server on foreground
exec npm run preview -- --port 3000 --host 0.0.0.0
module.exports = {
  apps: [
    {
      name: 'puro-suco-newsletter-watcher',
      script: 'scripts/watch-newsletter.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/newsletter-watcher-error.log',
      out_file: 'logs/newsletter-watcher-out.log',
      log_file: 'logs/newsletter-watcher.log',
      time: true,
      restart_delay: 5000,
      max_restarts: 5,
    },
  ],
}

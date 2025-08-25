import { createServer } from 'http'

// Health check endpoint para Railway
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        status: 'healthy',
        service: 'newsletter-watcher',
        timestamp: new Date().toISOString(),
      })
    )
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`)
})

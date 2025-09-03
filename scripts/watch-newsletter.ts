#!/usr/bin/env tsx

import { watch } from 'fs'
import { join, basename, extname } from 'path'
import { existsSync } from 'fs'
import { spawn } from 'child_process'

// Start health check server for Railway
if (process.env.NODE_ENV === 'production') {
  void spawn('tsx', ['scripts/health-check.ts'], {
    stdio: 'inherit',
    detached: false,
  })

  console.log('🏥 Health check server started')
}

const NEWSLETTERS_PATH = join(process.cwd(), 'src/content/newsletters')
const API_BASE_URL = process.env.PUBLIC_SITE_URL || 'http://localhost:4321'

console.log('🔍 Watching for new newsletters in:', NEWSLETTERS_PATH)
console.log('📡 API Base URL:', API_BASE_URL)

// Set para rastrear arquivos já processados (evitar duplicatas)
const processedFiles = new Set<string>()

// Função para enviar newsletter via API com retry
async function sendNewsletter(slug: string, retries = 3) {
  try {
    console.log(`📤 Sending newsletter: ${slug} (attempt ${4 - retries})`)

    const response = await fetch(`${API_BASE_URL}/api/send-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log(`✅ Newsletter "${slug}" sent successfully!`)
      console.log(`📊 Sent to ${result.sentCount} subscribers`)
      return true
    } else if (result.message?.includes('não encontrada') && retries > 0) {
      console.log(`⏳ Newsletter "${slug}" not ready yet, retrying in 5 seconds...`)
      await sleep(5000)
      return await sendNewsletter(slug, retries - 1)
    } else {
      console.error(`❌ Failed to send newsletter "${slug}":`, result.message)
      return false
    }
  } catch (error) {
    if (retries > 0) {
      console.log(`⚠️ Error sending newsletter "${slug}", retrying in 5 seconds...`)
      await sleep(5000)
      return await sendNewsletter(slug, retries - 1)
    }
    console.error(`❌ Error sending newsletter "${slug}":`, error)
    return false
  }
}

// Helper function for delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Função para extrair slug do nome do arquivo
function getSlugFromFilename(filename: string): string {
  return basename(filename, extname(filename))
}

// Função para validar se é um arquivo de newsletter válido (não draft)
function isValidNewsletterFile(filename: string): boolean {
  return filename.endsWith('.md') && !filename.startsWith('.') && !filename.startsWith('_')
}

// Função para verificar se é um arquivo draft
function isDraftFile(filename: string): boolean {
  return filename.startsWith('_') && filename.endsWith('.md')
}

// Watcher principal
const watcher = watch(NEWSLETTERS_PATH, async (eventType, filename) => {
  if (!filename) return

  const fullPath = join(NEWSLETTERS_PATH, filename)
  const slug = getSlugFromFilename(filename)

  // Verificar se é um arquivo draft
  if (isDraftFile(filename)) {
    console.log(`📝 Draft file detected: ${filename} (ignored)`)
    return
  }

  // Se não é um arquivo de newsletter válido, ignorar
  if (!isValidNewsletterFile(filename)) {
    return
  }

  // Apenas processa eventos de criação/modificação
  if (eventType === 'rename') {
    // 'rename' pode indicar criação ou exclusão
    if (existsSync(fullPath)) {
      // Arquivo foi criado
      if (!processedFiles.has(slug)) {
        console.log(`📝 New newsletter detected: ${filename}`)
        console.log(`🚀 Preparing to send newsletter: ${slug}`)
        processedFiles.add(slug)

        // Delay maior para o Astro processar o arquivo
        setTimeout(() => sendNewsletter(slug), 10000)
      }
    } else {
      // Arquivo foi removido
      processedFiles.delete(slug)
      console.log(`🗑️ Newsletter removed: ${filename}`)
    }
  }
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping newsletter watcher...')
  watcher.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  watcher.close()
  process.exit(0)
})

console.log('✅ Newsletter watcher started! Press Ctrl+C to stop.')

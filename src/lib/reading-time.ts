/**
 * Calculate reading time for text content
 * Based on average reading speed of 200 words per minute
 */

const AVERAGE_WPM = 200 // words per minute
const AVERAGE_CPS = 1000 // characters per second (for code blocks)

interface ReadingTimeResult {
  minutes: number
  words: number
  text: string
}

/**
 * Calculate reading time from markdown content
 */
export function calculateReadingTime(content: string): ReadingTimeResult {
  if (!content || content.trim().length === 0) {
    return {
      minutes: 1,
      words: 0,
      text: '1 min de leitura',
    }
  }

  // Remove frontmatter (content between --- at the beginning)
  let cleanContent = content.replace(/^---[\s\S]*?---\n/g, '')

  // Remove code blocks and count them separately (they take longer to read)
  const codeBlockRegex = /```[\s\S]*?```/g
  const codeBlocks = cleanContent.match(codeBlockRegex) || []
  cleanContent = cleanContent.replace(codeBlockRegex, '')

  // Remove inline code
  cleanContent = cleanContent.replace(/`[^`]*`/g, '')

  // Remove markdown syntax
  cleanContent = cleanContent
    .replace(/#{1,6}\s/g, '') // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/~~([^~]+)~~/g, '$1') // strikethrough
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // images
    .replace(/>\s*/g, '') // blockquotes
    .replace(/[-*+]\s+/g, '') // list items
    .replace(/\d+\.\s+/g, '') // numbered lists
    .replace(/\n+/g, ' ') // line breaks
    .replace(/\s+/g, ' ') // multiple spaces
    .trim()

  // Count words in clean content
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length

  // Calculate additional time for code blocks (assume they take 3x longer)
  const codeBlockChars = codeBlocks.join('').length
  const codeReadingTime = (codeBlockChars / AVERAGE_CPS / 60) * 3

  // Calculate total reading time
  const textReadingTime = words / AVERAGE_WPM
  const totalMinutes = Math.max(1, Math.ceil(textReadingTime + codeReadingTime))

  return {
    minutes: totalMinutes,
    words: words,
    text: `${totalMinutes} min de leitura`,
  }
}

/**
 * Calculate reading time from HTML content
 */
export function calculateReadingTimeFromHTML(html: string): ReadingTimeResult {
  if (!html || html.trim().length === 0) {
    return {
      minutes: 1,
      words: 0,
      text: '1 min de leitura',
    }
  }

  // Remove HTML tags and extract text content
  const cleanText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // remove styles
    .replace(/<[^>]*>/g, ' ') // remove HTML tags
    .replace(/&[^;]+;/g, ' ') // remove HTML entities
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim()

  // Count words
  const words = cleanText.split(/\s+/).filter(word => word.length > 0).length

  // Calculate reading time
  const minutes = Math.max(1, Math.ceil(words / AVERAGE_WPM))

  return {
    minutes: minutes,
    words: words,
    text: `${minutes} min de leitura`,
  }
}

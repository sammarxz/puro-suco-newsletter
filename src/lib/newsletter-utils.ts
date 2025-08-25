import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

export type NewsletterEntry = CollectionEntry<'newsletters'>

/**
 * Filter function to exclude draft newsletters (files starting with _)
 */
function filterDrafts(entry: NewsletterEntry): boolean {
  return !entry.slug.startsWith('_')
}

/**
 * Get all published newsletters (excluding drafts) sorted by publication date (most recent first)
 * and automatically mark the most recent one as featured
 */
export async function getNewslettersWithAutoFeatured(): Promise<NewsletterEntry[]> {
  const newsletters = await getCollection('newsletters', filterDrafts)

  // Sort newsletters by publication date (most recent first)
  const sortedNewsletters = newsletters.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  )

  // Mark the most recent newsletter as featured automatically
  return sortedNewsletters.map((newsletter, index) => ({
    ...newsletter,
    data: {
      ...newsletter.data,
      // Override featured status: true for most recent, false for others
      featured: index === 0,
    },
  }))
}

/**
 * Get the most recent (featured) newsletter
 */
export async function getFeaturedNewsletter(): Promise<NewsletterEntry | null> {
  const newsletters = await getNewslettersWithAutoFeatured()
  return newsletters.length > 0 ? newsletters[0] : null
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

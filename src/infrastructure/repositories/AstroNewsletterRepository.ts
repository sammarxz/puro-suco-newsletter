import { getCollection } from 'astro:content'
import { NewsletterRepository } from '../../domain/repositories/NewsletterRepository'
import { NewsletterIssue } from '../../domain/entities/NewsletterIssue'
import { calculateReadingTime } from '../../lib/reading-time'
import type { CollectionEntry } from 'astro:content'

/**
 * Filter function to exclude draft newsletters (files starting with _)
 */
function filterDrafts(entry: CollectionEntry<'newsletters'>): boolean {
  return !entry.slug.startsWith('_')
}

/**
 * Implementação do NewsletterRepository usando Astro Content Collections
 * Combina dados do Astro com entidades de domínio
 */
export class AstroNewsletterRepository implements NewsletterRepository {
  async findBySlug(slug: string): Promise<NewsletterIssue | null> {
    // Only search in non-draft newsletters
    const newsletters = await getCollection('newsletters', filterDrafts)
    const newsletter = newsletters.find(n => n.slug === slug)

    if (!newsletter) {
      return null
    }

    return this.collectionEntryToNewsletterIssue(newsletter)
  }

  async findAll(): Promise<NewsletterIssue[]> {
    const newsletters = await getCollection('newsletters', filterDrafts)
    const sortedNewsletters = newsletters.sort(
      (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    )

    return sortedNewsletters.map(newsletter => this.collectionEntryToNewsletterIssue(newsletter))
  }

  async findLatest(): Promise<NewsletterIssue | null> {
    const newsletters = await this.findAll()
    return newsletters.length > 0 ? newsletters[0] : null
  }

  async findPublished(): Promise<NewsletterIssue[]> {
    const newsletters = await this.findAll()
    const now = new Date()

    return newsletters.filter(newsletter => newsletter.getPublishedAt() <= now)
  }

  /**
   * Converte uma CollectionEntry do Astro em NewsletterIssue entity
   */
  private collectionEntryToNewsletterIssue(entry: CollectionEntry<'newsletters'>): NewsletterIssue {
    // Renderizar o conteúdo Markdown para HTML
    // Note: Em produção, você pode querer cache isso
    const content = this.markdownToHtml(entry.body)

    // Calculate reading time automatically if not provided
    const readingTime = entry.data.readingTime || calculateReadingTime(entry.body).minutes

    return NewsletterIssue.create({
      id: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      content,
      slug: entry.slug,
      issue: entry.data.issue,
      publishedAt: entry.data.publishedAt,
      tags: entry.data.tags || [],
      readingTime: readingTime,
      previewText: entry.data.previewText || entry.data.description,
    })
  }

  /**
   * Converte Markdown para HTML (simplificado)
   * Em produção, você pode usar uma biblioteca como marked ou remark
   */
  private markdownToHtml(markdown: string): string {
    // Por enquanto, retorna o markdown bruto
    // TODO: Implementar conversão real Markdown -> HTML para emails
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(.*)$/gim, '<p>$1</p>')
      .replace(/<p><h/gim, '<h')
      .replace(/<\/h([1-6])><\/p>/gim, '</h$1>')
  }

  /**
   * Método auxiliar para buscar newsletters por tag
   */
  async findByTag(tag: string): Promise<NewsletterIssue[]> {
    const newsletters = await this.findAll()
    return newsletters.filter(newsletter => newsletter.getTags().includes(tag))
  }

  /**
   * Método auxiliar para buscar newsletters em um período
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<NewsletterIssue[]> {
    const newsletters = await this.findAll()
    return newsletters.filter(newsletter => {
      const publishedAt = newsletter.getPublishedAt()
      return publishedAt >= startDate && publishedAt <= endDate
    })
  }
}

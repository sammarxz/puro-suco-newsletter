/**
 * NewsletterIssue Entity
 * Representa uma edição específica da newsletter com suas regras de negócio
 */
export class NewsletterIssue {
  private constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private readonly content: string,
    private readonly slug: string,
    private readonly issue: number,
    private readonly publishedAt: Date,
    private readonly tags: string[],
    private readonly readingTime: number,
    private readonly previewText?: string
  ) {}

  static create(data: {
    id: string
    title: string
    description: string
    content: string
    slug: string
    issue: number
    publishedAt: Date
    tags: string[]
    readingTime: number
    previewText?: string
  }): NewsletterIssue {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Newsletter title is required')
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Newsletter content is required')
    }

    if (data.issue <= 0) {
      throw new Error('Newsletter issue must be positive')
    }

    return new NewsletterIssue(
      data.id,
      data.title.trim(),
      data.description.trim(),
      data.content,
      data.slug,
      data.issue,
      data.publishedAt,
      data.tags,
      data.readingTime,
      data.previewText?.trim()
    )
  }

  // Getters
  getId(): string {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getDescription(): string {
    return this.description
  }

  getContent(): string {
    return this.content
  }

  getSlug(): string {
    return this.slug
  }

  getIssue(): number {
    return this.issue
  }

  getPublishedAt(): Date {
    return this.publishedAt
  }

  getTags(): string[] {
    return [...this.tags] // Return copy to maintain immutability
  }

  getReadingTime(): number {
    return this.readingTime
  }

  getPreviewText(): string {
    return this.previewText || this.description
  }

  // Business methods
  isPublished(): boolean {
    return this.publishedAt <= new Date()
  }

  getEmailSubject(): string {
    return `${this.title} - Puro Suco #${this.issue}`
  }

  // Para envio de email
  toEmailData() {
    return {
      title: this.getTitle(),
      content: this.getContent(),
      previewText: this.getPreviewText(),
      issue: this.getIssue(),
      slug: this.getSlug(),
    }
  }
}

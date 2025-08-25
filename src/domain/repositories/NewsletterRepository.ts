import { NewsletterIssue } from '../entities/NewsletterIssue'

export interface NewsletterRepository {
  save(newsletter: NewsletterIssue): Promise<void>
  update(newsletter: NewsletterIssue): Promise<void>
  findBySlug(slug: string): Promise<NewsletterIssue | null>
  findAll(): Promise<NewsletterIssue[]>
  findLatest(): Promise<NewsletterIssue | null>
  findPublished(): Promise<NewsletterIssue[]>
  findByDateRange(startDate: Date, endDate: Date): Promise<NewsletterIssue[]>
  findByIssueNumber(issue: number): Promise<NewsletterIssue | null>
  getTotalCount(): Promise<number>
}

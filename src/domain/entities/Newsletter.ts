export interface Newsletter {
  id: string
  title: string
  description: string
  content: string
  publishedAt: Date
  tags: string[]
  featured: boolean
  slug: string
  previewText?: string
}

export interface Subscriber {
  id: string
  email: string
  subscribedAt: Date
  isActive: boolean
  unsubscribeToken: string
}

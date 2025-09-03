import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context: any) {
  const newsletters = await getCollection('newsletters')

  // Sort by publication date (newest first)
  const sortedNewsletters = newsletters
    .filter(newsletter => newsletter.data.publishedAt <= new Date())
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())

  return rss({
    title: 'Puro Suco Newsletter',
    description:
      'Newsletter semanal com as melhores notícias de tech, desenvolvimento e design. Curadoria manual, sem spam.',
    site: context.site || 'https://purosuco.dev',
    items: sortedNewsletters.map(newsletter => ({
      title: newsletter.data.title,
      description: newsletter.data.description,
      pubDate: newsletter.data.publishedAt,
      link: `/newsletters/${newsletter.slug}`,
      content: newsletter.body,
      categories: newsletter.data.tags,
      author: 'Puro Suco Newsletter',
    })),
    customData: `<language>pt-BR</language>`,
    trailingSlash: false,
  })
}

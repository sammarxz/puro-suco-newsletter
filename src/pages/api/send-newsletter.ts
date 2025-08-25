import type { APIRoute } from 'astro'
import { z } from 'zod'
import { getCollection, getEntry } from 'astro:content'
import { container, TOKENS } from '../../lib/container/bindings'
import { NewsletterSendingUseCase } from '../../domain/usecases/NewsletterSendingUseCase'
import { NewsletterIssue } from '../../domain/entities/NewsletterIssue'
import { calculateReadingTime } from '../../lib/reading-time'

const sendNewsletterSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório'),
})

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json()

    const validationResult = sendNewsletterSchema.safeParse(body)
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Dados inválidos',
          errors: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { slug } = validationResult.data

    const newsletterEntry = await getEntry('newsletters', slug)
    if (!newsletterEntry) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Newsletter não encontrada',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Filter out drafts (files starting with _)
    const allNewsletters = await getCollection('newsletters', entry => !entry.slug.startsWith('_'))
    const newsletterNumber = allNewsletters.length

    // Calculate reading time automatically if not provided
    const readingTime =
      newsletterEntry.data.readingTime || calculateReadingTime(newsletterEntry.body).minutes

    const newsletterIssue = NewsletterIssue.create({
      id: newsletterEntry.slug,
      title: newsletterEntry.data.title,
      description: newsletterEntry.data.description || newsletterEntry.data.excerpt || '',
      content: newsletterEntry.body,
      slug: newsletterEntry.slug,
      publishedAt: new Date(newsletterEntry.data.publishedAt),
      issue: newsletterEntry.data.issue || newsletterNumber,
      tags: newsletterEntry.data.tags || [],
      readingTime: readingTime,
      previewText: newsletterEntry.data.previewText || newsletterEntry.data.excerpt || '',
    })

    const sendingUseCase = await container.resolve<NewsletterSendingUseCase>(
      TOKENS.NEWSLETTER_SENDING_USE_CASE
    )

    const baseUrl = import.meta.env.PUBLIC_SITE_URL || url.origin
    const result = await sendingUseCase.sendToAllSubscribers(newsletterIssue, baseUrl)

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Send newsletter error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Erro interno do servidor',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

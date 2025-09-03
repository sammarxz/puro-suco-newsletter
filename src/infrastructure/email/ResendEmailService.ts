import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '../../../emails/templates/welcome-email'
import ConfirmationEmail from '../../../emails/templates/confirmation-email'
import NewsletterTemplate from '../../../emails/templates/newsletter-template'
import type { EmailService } from '../../domain/services/EmailService'

export class ResendEmailService implements EmailService {
  private resend: Resend
  private fromEmail: string

  constructor(apiKey: string, fromEmail?: string) {
    this.resend = new Resend(apiKey)
    this.fromEmail = fromEmail || 'Puro Suco <newsletter@purosuco.dev>'
  }

  async sendWelcomeEmail(to: string, unsubscribeUrl: string): Promise<void> {
    try {
      const emailHtml = await render(
        WelcomeEmail({
          email: to,
          unsubscribeUrl,
        })
      )

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Bem-vindo ao Puro Suco! 🍊',
        html: emailHtml,
        headers: {
          'X-Newsletter-Type': 'welcome',
        },
      })
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      throw new Error('Failed to send welcome email')
    }
  }

  async sendConfirmationEmail(to: string, confirmationUrl: string): Promise<void> {
    try {
      const emailHtml = await render(
        ConfirmationEmail({
          email: to,
          confirmationUrl,
        })
      )

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Confirme sua inscrição no Puro Suco 🍊',
        html: emailHtml,
        headers: {
          'X-Newsletter-Type': 'confirmation',
        },
      })
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
      throw new Error('Failed to send confirmation email')
    }
  }

  async sendNewsletter(
    to: string[],
    newsletterData: {
      title: string
      content: string
      previewText: string
      issue: number
      slug: string
    },
    baseUnsubscribeUrl: string
  ): Promise<void> {
    try {
      // Get base URL for logo in email
      const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:4321'

      const emailHtml = await render(
        NewsletterTemplate({
          title: newsletterData.title,
          content: newsletterData.content, // Pass raw markdown to the template
          previewText: newsletterData.previewText,
          issue: newsletterData.issue,
          unsubscribeUrl: baseUnsubscribeUrl,
          baseUrl: baseUrl,
        })
      )

      // Envio em lotes de 50 emails para respeitar rate limits
      const batchSize = 50
      const batches = []

      for (let i = 0; i < to.length; i += batchSize) {
        batches.push(to.slice(i, i + batchSize))
      }

      for (const batch of batches) {
        // Criar promises para envio paralelo dentro do lote
        const sendPromises = batch.map(async email => {
          // Gerar URL de unsubscribe personalizada com email e token
          // Precisamos buscar o token do subscriber - por agora usar email apenas
          const personalizedUnsubscribeUrl = `${baseUnsubscribeUrl}?email=${encodeURIComponent(email)}`

          const personalizedHtml = emailHtml.replace(
            new RegExp(baseUnsubscribeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            personalizedUnsubscribeUrl
          )

          return this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `${newsletterData.title} - Puro Suco #${newsletterData.issue}`,
            html: personalizedHtml,
            headers: {
              'X-Newsletter-Type': 'newsletter',
              'X-Newsletter-Issue': newsletterData.issue.toString(),
              'X-Newsletter-Slug': newsletterData.slug,
            },
          })
        })

        // Aguardar o lote atual antes do próximo
        await Promise.all(sendPromises)

        // Pausa entre lotes para respeitar rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await this.sleep(1000) // 1 segundo entre lotes
        }
      }
    } catch (error) {
      console.error('Failed to send newsletter batch:', error)
      throw new Error('Failed to send newsletter')
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

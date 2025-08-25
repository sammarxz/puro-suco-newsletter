export interface EmailService {
  sendWelcomeEmail(to: string, unsubscribeUrl: string): Promise<void>
  sendConfirmationEmail(to: string, confirmationUrl: string): Promise<void>
  sendNewsletter(
    to: string[],
    newsletterData: {
      title: string
      content: string
      previewText: string
      issue: number
      slug: string
    },
    unsubscribeUrl: string
  ): Promise<void>
}

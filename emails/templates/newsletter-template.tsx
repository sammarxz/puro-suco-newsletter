import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
  Img,
} from '@react-email/components'

// Helper function to add inline styles for email clients matching Puro Suco design
function addEmailStyles(htmlContent: string): string {
  return htmlContent
    .replace(
      /<h1>/g,
      '<h1 style="font-family: Source Serif 4, Georgia, serif; font-size: 36px; font-weight: 400; color: #111827; margin: 32px 0 20px 0; line-height: 1.25;">'
    )
    .replace(
      /<h2>/g,
      '<h2 style="font-family: Source Serif 4, Georgia, serif; font-size: 30px; font-weight: 400; color: #111827; margin: 32px 0 16px 0; line-height: 1.3;">'
    )
    .replace(
      /<h3>/g,
      '<h3 style="font-family: Source Serif 4, Georgia, serif; font-size: 24px; font-weight: 400; color: #111827; margin: 28px 0 12px 0; line-height: 1.33;">'
    )
    .replace(
      /<p>/g,
      '<p style="font-family: Inter, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 20px 0;">'
    )
    .replace(/<ul>/g, '<ul style="margin: 20px 0; padding-left: 28px; color: #374151;">')
    .replace(/<ol>/g, '<ol style="margin: 20px 0; padding-left: 28px; color: #374151;">')
    .replace(
      /<li>/g,
      '<li style="font-family: Inter, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #374151; margin: 8px 0;">'
    )
    .replace(
      /<a /g,
      '<a style="color: #F59E0B; text-decoration: underline; transition: color 0.15s ease;" '
    )
    .replace(/<strong>/g, '<strong style="font-weight: 600; color: #111827;">')
    .replace(/<em>/g, '<em style="font-style: italic; color: #6B7280;">')
    .replace(
      /<blockquote>/g,
      '<blockquote style="border-left: 4px solid #F59E0B; margin: 24px 0; padding: 16px 24px; background-color: #FEFCE8; font-style: italic; color: #92400E;">'
    )
    .replace(
      /<code>/g,
      '<code style="background-color: #F3F4F6; padding: 3px 8px; border-radius: 4px; font-family: Monaco, Consolas, monospace; font-size: 14px; color: #1F2937;">'
    )
    .replace(/<hr>/g, '<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">')
}

interface NewsletterEmailProps {
  title: string
  content: string
  previewText: string
  unsubscribeUrl: string
  issue: number
  baseUrl?: string
}

export default function NewsletterEmail({
  title,
  content,
  previewText,
  unsubscribeUrl,
  issue,
  baseUrl = 'http://localhost:4321',
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Source Serif 4"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/sourceserif4/v8/vEFV2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUGfiq.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <table style={{ width: '100%', textAlign: 'center' as const }}>
              <tr>
                <td>
                  <Img
                    src={`${baseUrl}/logo.png`}
                    alt="Logo Puro Suco"
                    width="64"
                    height="64"
                    style={logoImage}
                  />
                  <Text style={issueNumber}>Edição #{issue}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={divider} />

          {/* Content */}
          <Section style={contentSection}>
            <Heading style={titleStyle}>{title}</Heading>
            <div
              style={contentBody}
              dangerouslySetInnerHTML={{
                __html: addEmailStyles(content),
              }}
            />
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Newsletter semanal com as melhores notícias de tech, desenvolvimento e design.
            </Text>
            <Text style={authorText}>
              Curado por{' '}
              <Link href="https://marxz.me" style={authorLink}>
                @sammarxz
              </Link>
            </Text>
            <Text style={footerText}>
              Dev & Designer que já passou pela dor de filtrar notícias tech
            </Text>
            <Text style={unsubscribeText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Cancelar inscrição
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
  padding: '0',
}

const container = {
  margin: '0 auto',
  padding: '32px 20px',
  maxWidth: '512px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
}

const logoImage = {
  display: 'block',
  margin: '0 auto 16px auto',
  borderRadius: '8px',
}

const issueNumber = {
  fontSize: '14px',
  color: '#9CA3AF',
  margin: '0',
  fontFamily: 'Inter, Arial, sans-serif',
}

const divider = {
  borderColor: '#E5E7EB',
  margin: '40px 0',
  borderWidth: '1px 0 0 0',
  borderStyle: 'solid',
}

const contentSection = {
  marginBottom: '40px',
}

const titleStyle = {
  fontFamily: 'Source Serif 4, Georgia, serif',
  fontSize: '40px',
  fontWeight: '400',
  color: '#111827',
  lineHeight: '1.25',
  margin: '0 0 32px 0',
  textAlign: 'left' as const,
}

const contentBody = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  fontFamily: 'Inter, Arial, sans-serif',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '40px',
}

const footerText = {
  fontSize: '16px',
  color: '#6B7280',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  fontFamily: 'Inter, Arial, sans-serif',
}

const authorText = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0 0 4px 0',
  fontFamily: 'Inter, Arial, sans-serif',
}

const authorLink = {
  color: '#F59E0B',
  textDecoration: 'underline',
  fontWeight: '500',
}

const unsubscribeText = {
  fontSize: '14px',
  color: '#9CA3AF',
  lineHeight: '1.6',
  margin: '20px 0 0 0',
  fontFamily: 'Inter, Arial, sans-serif',
}

const unsubscribeLink = {
  color: '#9CA3AF',
  textDecoration: 'underline',
}

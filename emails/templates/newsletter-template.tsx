import { Section, Heading, Row, Column, Markdown, Hr } from '@react-email/components'
import EmailLayout from '../components/EmailLayout'
import EmailHeader from '../components/EmailHeader'
import EmailFooter from '../components/EmailFooter'
import { emailStyles, designTokens } from '../styles/design-tokens'
import { getLogoUrl } from '../utils/env'

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
  baseUrl: _baseUrl,
}: NewsletterEmailProps) {
  // Estilos para markdown que espelham o design do site (prose do Tailwind)
  const markdownStyles = {
    h1: {
      fontFamily: designTokens.fonts.serif,
      fontSize: designTokens.typography.sizes['4xl'],
      fontWeight: designTokens.typography.fontWeights.normal,
      color: designTokens.colors.text.primary,
      margin: `${designTokens.spacing['2xl']} 0 ${designTokens.spacing.lg} 0`,
      lineHeight: designTokens.typography.lineHeights.tight,
    },
    h2: {
      fontFamily: designTokens.fonts.serif,
      fontSize: designTokens.typography.sizes['3xl'],
      fontWeight: designTokens.typography.fontWeights.normal,
      color: designTokens.colors.text.primary,
      margin: `${designTokens.spacing['2xl']} 0 ${designTokens.spacing.md} 0`,
      lineHeight: designTokens.typography.lineHeights.snug,
    },
    h3: {
      fontFamily: designTokens.fonts.serif,
      fontSize: designTokens.typography.sizes['2xl'],
      fontWeight: designTokens.typography.fontWeights.normal,
      color: designTokens.colors.text.primary,
      margin: `${designTokens.spacing.xl} 0 ${designTokens.spacing.sm} 0`,
      lineHeight: designTokens.typography.lineHeights.snug,
    },
    h4: {
      fontFamily: designTokens.fonts.serif,
      fontSize: designTokens.typography.sizes.xl,
      fontWeight: designTokens.typography.fontWeights.semibold,
      color: designTokens.colors.text.primary,
      margin: `${designTokens.spacing.lg} 0 ${designTokens.spacing.sm} 0`,
      lineHeight: designTokens.typography.lineHeights.snug,
    },
    p: emailStyles.paragraph,
    a: {
      color: designTokens.colors.primary,
      textDecoration: 'underline',
      fontWeight: designTokens.typography.fontWeights.medium,
    },
    strong: {
      fontWeight: designTokens.typography.fontWeights.semibold,
      color: designTokens.colors.text.primary,
    },
    em: {
      fontStyle: 'italic',
      color: designTokens.colors.text.secondary,
    },
    blockquote: emailStyles.blockquote,
    code: emailStyles.code,
    ul: emailStyles.list,
    ol: emailStyles.list,
    li: emailStyles.listItem,
    hr: {
      border: 'none',
      borderTop: `1px solid ${designTokens.colors.border.primary}`,
      margin: `${designTokens.spacing['2xl']} 0`,
    },
  }

  return (
    <EmailLayout preview={previewText}>
      <EmailHeader logoUrl={getLogoUrl()} issueNumber={issue} />

      {/* Main Content */}
      <Section>
        <Row>
          <Column>
            <Heading style={emailStyles.heading}>{title}</Heading>
            <Hr style={emailStyles.hr} />
            <Markdown
              markdownCustomStyles={markdownStyles}
              markdownContainerStyles={{
                padding: '0',
              }}
            >
              {content}
            </Markdown>
          </Column>
        </Row>
      </Section>

      <EmailFooter unsubscribeUrl={unsubscribeUrl} />
    </EmailLayout>
  )
}

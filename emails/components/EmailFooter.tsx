import { Section, Text, Link, Hr, Row, Column } from '@react-email/components'
import { emailStyles, designTokens } from '../styles/design-tokens'

interface EmailFooterProps {
  unsubscribeUrl?: string
  showUnsubscribe?: boolean
  additionalText?: string
  className?: string
}

export default function EmailFooter({
  unsubscribeUrl,
  showUnsubscribe = true,
  additionalText,
  className = '',
}: EmailFooterProps) {
  const unsubscribeLinkStyle = {
    color: designTokens.colors.primary,
    textDecoration: 'underline',
  }

  const footerLinkStyle = {
    color: designTokens.colors.primary,
    textDecoration: 'none',
  }

  return (
    <Section style={emailStyles.footer} className={className}>
      <Hr style={emailStyles.hr} />
      <Row>
        <Column>
          {additionalText && <Text style={emailStyles.footerText}>{additionalText}</Text>}
          <Text style={emailStyles.footerText}>
            Newsletter semanal com as melhores notícias de tech, desenvolvimento e design.
          </Text>
          <Text style={emailStyles.footerText}>
            {showUnsubscribe && unsubscribeUrl && (
              <>
                <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
                  Cancelar inscrição
                </Link>
                {' • '}
              </>
            )}
            <strong>Puro Suco Newsletter</strong> • Criado por{' '}
            <Link href="https://marxz.me" style={footerLinkStyle}>
              Sam Marxz
            </Link>
          </Text>
        </Column>
      </Row>
    </Section>
  )
}

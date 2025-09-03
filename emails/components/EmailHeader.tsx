import { Section, Img, Text, Row, Column } from '@react-email/components'
import { designTokens, emailStyles } from '../styles/design-tokens'
import { getLogoUrl } from '../utils/env'

interface EmailHeaderProps {
  logoUrl?: string
  issueNumber?: number
  className?: string
}

export default function EmailHeader({ logoUrl, issueNumber, className = '' }: EmailHeaderProps) {
  const finalLogoUrl = logoUrl || getLogoUrl()
  const headerStyle = {
    padding: `0 0 ${designTokens.spacing['3xl']} 0`,
  }

  const logoStyle = {
    display: 'block',
  }

  const headerContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  }

  return (
    <Section style={headerStyle} className={className}>
      <Row>
        <Column style={headerContentStyle}>
          <Img src={finalLogoUrl} width="42" height="42" alt="Puro Suco" style={logoStyle} />
          {issueNumber && <Text style={emailStyles.badge}>EDIÇÃO #{issueNumber}</Text>}
        </Column>
      </Row>
    </Section>
  )
}

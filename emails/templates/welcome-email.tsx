import { Section, Text, Button, Heading, Row, Column } from '@react-email/components'
import EmailLayout from '../components/EmailLayout'
import EmailHeader from '../components/EmailHeader'
import EmailFooter from '../components/EmailFooter'
import { emailStyles, designTokens } from '../styles/design-tokens'
import { getSiteUrl } from 'emails/utils/env'

interface WelcomeEmailProps {
  email: string
  unsubscribeUrl: string
}

export default function WelcomeEmail({ email, unsubscribeUrl }: WelcomeEmailProps) {
  const buttonContainerStyle = {
    margin: `${designTokens.spacing['2xl']} 0`,
  }

  const listItemStyle = {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.base,
    lineHeight: designTokens.typography.lineHeights.relaxed,
    color: designTokens.colors.text.secondary,
    margin: `0 0 ${designTokens.spacing.xs} 0`,
  }

  return (
    <EmailLayout preview="Bem-vindo ao Puro Suco Newsletter!">
      <EmailHeader />

      {/* Main Content */}
      <Section>
        <Row>
          <Column>
            <Heading style={emailStyles.heading}>Bem-vindo ao Puro Suco!</Heading>

            <Text style={emailStyles.paragraph}>
              Olá! Obrigado por se inscrever na nossa newsletter semanal.
            </Text>

            <Text style={emailStyles.paragraph}>
              Toda semana você receberá em <strong>{email}</strong> uma curadoria especial com:
            </Text>

            <Text style={listItemStyle}>• Principais tendências em desenvolvimento web</Text>
            <Text style={listItemStyle}>• Ferramentas e bibliotecas em destaque</Text>
            <Text style={listItemStyle}>• Novidades em design e UX</Text>
            <Text style={listItemStyle}>• Artigos e recursos recomendados</Text>

            <Section style={buttonContainerStyle}>
              <Button href={`${getSiteUrl()}/newsletters`} style={emailStyles.button}>
                <Text style={emailStyles.buttonText}>Conheça nosso arquivo</Text>
              </Button>
            </Section>
          </Column>
        </Row>
      </Section>

      <EmailFooter unsubscribeUrl={unsubscribeUrl} />
    </EmailLayout>
  )
}

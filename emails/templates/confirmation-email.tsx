import { Section, Text, Link, Button, Hr, Heading, Row, Column } from '@react-email/components'
import EmailLayout from '../components/EmailLayout'
import EmailHeader from '../components/EmailHeader'
import EmailFooter from '../components/EmailFooter'
import { emailStyles, designTokens } from '../styles/design-tokens'

interface ConfirmationEmailProps {
  email: string
  confirmationUrl: string
}

export default function ConfirmationEmail({ email, confirmationUrl }: ConfirmationEmailProps) {
  const buttonContainerStyle = {
    margin: `${designTokens.spacing['2xl']} 0`,
  }

  const smallTextStyle = {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.sm,
    lineHeight: designTokens.typography.lineHeights.normal,
    color: designTokens.colors.text.muted,
    margin: `${designTokens.spacing.md} 0 ${designTokens.spacing.xs} 0`,
  }

  const linkTextStyle = {
    margin: `0 0 ${designTokens.spacing.xl} 0`,
  }

  const linkStyle = {
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.sizes.sm,
    textDecoration: 'underline',
    wordBreak: 'break-all' as const,
  }

  const listItemStyle = {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.base,
    lineHeight: designTokens.typography.lineHeights.relaxed,
    color: designTokens.colors.text.secondary,
    margin: `0 0 ${designTokens.spacing.xs} 0`,
  }

  return (
    <EmailLayout preview="Confirme sua inscrição na newsletter Puro Suco">
      <EmailHeader />

      {/* Main Content */}
      <Section>
        <Row>
          <Column>
            <Heading style={emailStyles.heading}>Confirme sua inscrição</Heading>

            <Text style={emailStyles.paragraph}>
              Olá! Você solicitou a inscrição na newsletter <strong>Puro Suco</strong> com o email{' '}
              <strong>{email}</strong>.
            </Text>

            <Text style={emailStyles.paragraph}>
              Para confirmar sua inscrição e começar a receber nosso conteúdo semanal sobre tech,
              desenvolvimento e design, clique no botão abaixo:
            </Text>

            <Section style={buttonContainerStyle}>
              <Button href={confirmationUrl} style={emailStyles.button}>
                <Text style={emailStyles.buttonText}>Confirmar Inscrição</Text>
              </Button>
            </Section>

            <Text style={smallTextStyle}>Ou copie e cole este link no seu navegador:</Text>
            <Text style={linkTextStyle}>
              <Link href={confirmationUrl} style={linkStyle}>
                {confirmationUrl}
              </Link>
            </Text>

            <Hr style={emailStyles.hr} />

            <Text style={emailStyles.paragraph}>
              Após a confirmação, você receberá um email de boas-vindas e passará a receber nossas
              newsletters semanais com:
            </Text>

            <Text style={listItemStyle}>• As melhores notícias de tecnologia</Text>
            <Text style={listItemStyle}>• Dicas de desenvolvimento e design</Text>
            <Text style={listItemStyle}>• Ferramentas e recursos úteis</Text>
            <Text style={listItemStyle}>• Insights e reflexões do Sam</Text>

            <Text style={smallTextStyle}>
              <strong>Importante:</strong> Este link expira em 24 horas. Se não conseguir confirmar
              a tempo, será necessário se inscrever novamente.
            </Text>
          </Column>
        </Row>
      </Section>

      <EmailFooter
        showUnsubscribe={false}
        additionalText="Esta é uma mensagem automática de confirmação. Se você não se inscreveu, pode ignorar este email."
      />
    </EmailLayout>
  )
}
